import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import type { SceneNode } from '../scene/sceneData'
import './Timeline.css'

// Flavor distances between consecutive tracks, in light years — the
// wormhole cut and the nebula read as long hauls, the final approach
// home compresses, echoing the atmosphere thickening toward the end.
const LY_GAPS = [42.6, 128.3, 7.4, 316.0, 54.2, 19.8, 2.1]

const GAP_MIN = 56
const GAP_MAX = 220
const GAP_PER_LY = 0.55
const GAP_BASE = 40
const DOT_SIZE = 12
const RAIL_PADDING = 56 // matches .timeline-track's 28px top/bottom padding
const LABEL_FADE_FACTOR = 0.55

function baseGapPx(ly: number) {
  return Math.min(GAP_MAX, Math.max(GAP_MIN, GAP_BASE + ly * GAP_PER_LY))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

interface TimelineProps {
  nodes: SceneNode[]
  currentIndex: number
  onSelect: (index: number) => void
  zoom: number
  zoomMin: number
}

export default function Timeline({ nodes, currentIndex, onSelect, zoom, zoomMin }: TimelineProps) {
  const railRef = useRef<HTMLElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const [railHeight, setRailHeight] = useState(0)

  useLayoutEffect(() => {
    const el = railRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setRailHeight(entries[0].contentRect.height)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentIndex])

  // As the main scene zooms out, the rail compresses in step — at the
  // lowest zoom the whole tracklist fits in view with no scrolling,
  // mirroring the flight path also fully revealing itself at that point.
  const gapsSum = LY_GAPS.reduce((sum, ly) => sum + baseGapPx(ly), 0)
  const fixedHeight = nodes.length * DOT_SIZE + RAIL_PADDING
  const fitFactor = railHeight ? clamp((railHeight - fixedHeight) / gapsSum, 0, 1) : 1
  const t = zoomMin < 1 ? clamp((1 - zoom) / (1 - zoomMin), 0, 1) : 0
  const factor = 1 - t * (1 - fitFactor)
  const showDetail = factor > LABEL_FADE_FACTOR

  return (
    <nav className="timeline-rail" aria-label="Track timeline" ref={railRef}>
      <div className="timeline-track">
        <div className="timeline-line" />
        {nodes.map((node, i) => {
          const isActive = i === currentIndex
          return (
            <div className="timeline-item" key={node.id}>
              {i > 0 && (
                <div className="timeline-gap" style={{ height: baseGapPx(LY_GAPS[i - 1]) * factor }}>
                  <span className="timeline-ly" style={{ opacity: showDetail ? 1 : 0 }}>
                    {LY_GAPS[i - 1].toFixed(1)} ly
                  </span>
                </div>
              )}
              <div className="timeline-row">
                <span
                  className={`timeline-label${isActive ? ' active' : ''}`}
                  style={{ opacity: showDetail ? undefined : 0 }}
                >
                  {String(node.index + 1).padStart(2, '0')} · {node.title}
                </span>
                <button
                  ref={isActive ? activeRef : undefined}
                  className={`timeline-dot${isActive ? ' active' : ''}`}
                  onClick={() => onSelect(i)}
                  aria-label={`Go to ${node.title}`}
                  aria-current={isActive}
                >
                  <span className="timeline-dot-core" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
