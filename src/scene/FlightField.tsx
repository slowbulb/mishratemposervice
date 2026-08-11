import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FlightPath from './FlightPath'
import EnvironmentLayer from './EnvironmentLayer'
import WaypointMarker from './WaypointMarker'
import Rickshaw from '../objects/Rickshaw'
import { SCENE_HEIGHT, SCENE_NODES } from './sceneData'
import { useFlightNav } from './useFlightNav'
import { useAudioPlayer } from '../audio/useAudioPlayer'
import NavButtons from '../components/NavButtons'
import NowPlaying from '../components/NowPlaying'
import Starfield from '../components/Starfield'
import { TRACK_INTERACTIONS } from '../interaction/interactionConfig'
import { usePointerPosition } from '../interaction/usePointerPosition'
import BlackHoleCore from '../interaction/BlackHoleCore'
import './FlightField.css'

const SWIPE_THRESHOLD = 50
const WHEEL_NAV_THRESHOLD = 24
const WHEEL_NAV_COOLDOWN = 650
const ZOOM_MIN = 0.6
const ZOOM_MAX = 2
const CAMERA_TRANSITION = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const }
const ZOOM_TRANSITION = { duration: 0.2, ease: 'easeOut' as const }

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function touchDistance(a: Touch, b: Touch) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export default function FlightField() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 700, height: 800 })
  const [zoom, setZoom] = useState(1)

  const { currentIndex, currentNode, goNext, goPrev, canGoNext, canGoPrev } = useFlightNav()
  const audio = useAudioPlayer(currentNode.audioUrl)

  const interaction = TRACK_INTERACTIONS[currentNode.id]
  const interactionActive = Boolean(interaction) && audio.isPlaying
  const pointer = usePointerPosition(interactionActive)

  // A black hole gets a fresh hidden target (screen-space, near viewport
  // center where the current node always sits) each time you land on its
  // track — found by moving the pointer near it, not shown otherwise.
  const [blackHoleTarget, setBlackHoleTarget] = useState<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (interaction?.kind === 'blackhole') {
      const angle = Math.random() * Math.PI * 2
      const dist = 90 + Math.random() * 140
      setBlackHoleTarget({
        x: window.innerWidth / 2 + Math.cos(angle) * dist,
        y: window.innerHeight / 2 + Math.sin(angle) * dist,
      })
    } else {
      setBlackHoleTarget(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  let spotlight: { x: number; y: number; radius: number } | null = null
  let blackHole: { x: number; y: number; captureRadius: number; proximity: number } | null = null

  if (interactionActive && pointer) {
    if (interaction.kind === 'twinkle') {
      spotlight = { x: pointer.x, y: pointer.y, radius: interaction.radius }
    } else if (interaction.kind === 'blackhole' && blackHoleTarget) {
      const dist = Math.hypot(pointer.x - blackHoleTarget.x, pointer.y - blackHoleTarget.y)
      const influenceRadius = interaction.captureRadius * 2.6
      const proximity = clamp(1 - dist / influenceRadius, 0, 1)
      if (proximity > 0) {
        blackHole = { x: blackHoleTarget.x, y: blackHoleTarget.y, captureRadius: interaction.captureRadius, proximity }
      }
    }
  }

  // Native (non-passive) listeners are attached once; refs keep them reading
  // fresh values without needing to re-attach on every render.
  const goNextRef = useRef(goNext)
  const goPrevRef = useRef(goPrev)
  const zoomRef = useRef(zoom)
  goNextRef.current = goNext
  goPrevRef.current = goPrev
  zoomRef.current = zoom

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect
      setSize({ width: rect.width, height: rect.height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') goNextRef.current()
      if (e.key === 'ArrowUp') goPrevRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    let wheelLocked = false
    let touchStartY: number | null = null
    let pinchStartDist: number | null = null
    let pinchStartZoom = 1

    function onWheel(e: globalThis.WheelEvent) {
      e.preventDefault()
      // Mac trackpad pinch arrives as a wheel event with ctrlKey set.
      if (e.ctrlKey) {
        setZoom((z) => clamp(z - e.deltaY * 0.01, ZOOM_MIN, ZOOM_MAX))
        return
      }
      if (wheelLocked) return
      if (e.deltaY > WHEEL_NAV_THRESHOLD) {
        wheelLocked = true
        goNextRef.current()
        setTimeout(() => {
          wheelLocked = false
        }, WHEEL_NAV_COOLDOWN)
      } else if (e.deltaY < -WHEEL_NAV_THRESHOLD) {
        wheelLocked = true
        goPrevRef.current()
        setTimeout(() => {
          wheelLocked = false
        }, WHEEL_NAV_COOLDOWN)
      }
    }

    function onTouchStart(e: globalThis.TouchEvent) {
      if (e.touches.length === 2) {
        pinchStartDist = touchDistance(e.touches[0], e.touches[1])
        pinchStartZoom = zoomRef.current
        touchStartY = null
      } else if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
        pinchStartDist = null
      }
    }

    function onTouchMove(e: globalThis.TouchEvent) {
      if (e.touches.length === 2 && pinchStartDist !== null) {
        e.preventDefault()
        const dist = touchDistance(e.touches[0], e.touches[1])
        const ratio = dist / pinchStartDist
        setZoom(clamp(pinchStartZoom * ratio, ZOOM_MIN, ZOOM_MAX))
      }
    }

    function onTouchEnd(e: globalThis.TouchEvent) {
      if (e.touches.length === 0 && touchStartY !== null) {
        const dy = e.changedTouches[0].clientY - touchStartY
        if (dy < -SWIPE_THRESHOLD) goNextRef.current()
        else if (dy > SWIPE_THRESHOLD) goPrevRef.current()
      }
      touchStartY = null
      pinchStartDist = null
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const cameraX = size.width / 2 - currentNode.x * size.width
  const cameraY = size.height / 2 - currentNode.y

  return (
    <div ref={viewportRef} className="flight-viewport">
      <Starfield spotlight={spotlight} blackHole={blackHole} />

      <motion.div
        className="flight-world"
        style={{ width: size.width, height: SCENE_HEIGHT }}
        animate={{ x: cameraX, y: cameraY }}
        transition={CAMERA_TRANSITION}
      >
        <motion.div
          className="flight-world-scale"
          style={{
            width: size.width,
            height: SCENE_HEIGHT,
            transformOrigin: `${currentNode.x * size.width}px ${currentNode.y}px`,
          }}
          animate={{ scale: zoom }}
          transition={ZOOM_TRANSITION}
        >
          <FlightPath nodes={SCENE_NODES} width={size.width} height={SCENE_HEIGHT} />
          <EnvironmentLayer nodes={SCENE_NODES} fieldWidth={size.width} />
          {SCENE_NODES.map((node, i) =>
            i === currentIndex ? null : (
              <WaypointMarker key={node.id} node={node} distance={Math.abs(i - currentIndex)} fieldWidth={size.width} />
            ),
          )}
        </motion.div>
      </motion.div>

      {blackHole && <BlackHoleCore x={blackHole.x} y={blackHole.y} proximity={blackHole.proximity} />}

      <div className="flight-rickshaw">
        <motion.div animate={{ rotate: currentNode.headingDeg }} transition={CAMERA_TRANSITION}>
          <Rickshaw size={140} seed={currentIndex} />
        </motion.div>
      </div>

      <NowPlaying node={currentNode} total={SCENE_NODES.length} audio={audio} />
      <NavButtons onUp={goPrev} onDown={goNext} canUp={canGoPrev} canDown={canGoNext} />
    </div>
  )
}
