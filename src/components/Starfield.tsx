import { useMemo } from 'react'
import './Starfield.css'

const STAR_COUNT = 140

interface Star {
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export interface Spotlight {
  x: number
  y: number
  radius: number
}

export interface BlackHoleField {
  x: number
  y: number
  captureRadius: number
  intensity: number // 0..1, ramps up the longer the hole stays alive
}

interface StarfieldProps {
  spotlight?: Spotlight | null
  blackHole?: BlackHoleField | null
}

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() < 0.85 ? 1 : 2,
    delay: Math.random() * 6,
    duration: 3 + Math.random() * 5,
  }))
}

export default function Starfield({ spotlight, blackHole }: StarfieldProps) {
  const stars = useMemo(() => makeStars(STAR_COUNT), [])

  return (
    <div id="sky" aria-hidden="true">
      {stars.map((star, i) => {
        // #sky is position:fixed inset:0, so percentages map directly to
        // viewport px — the same coordinate space the pointer is tracked in.
        const px = (star.left / 100) * window.innerWidth
        const py = (star.top / 100) * window.innerHeight

        let transform = ''
        let filter = ''

        if (spotlight) {
          const dist = Math.hypot(px - spotlight.x, py - spotlight.y)
          if (dist < spotlight.radius) {
            const t = 1 - dist / spotlight.radius
            transform += ` scale(${(1 + t * 2.2).toFixed(2)})`
            filter = `drop-shadow(0 0 ${(3 + t * 7).toFixed(1)}px rgba(127, 209, 232, ${(0.4 + t * 0.6).toFixed(2)}))`
          }
        }

        if (blackHole) {
          const dx = blackHole.x - px
          const dy = blackHole.y - py
          const dist = Math.hypot(dx, dy)
          const influence = blackHole.captureRadius * 4.5
          if (dist < influence) {
            // Falls off with the square of distance, so the grip tightens
            // sharply near the horizon rather than dragging the whole sky.
            const falloff = 1 - dist / influence
            const t = Math.min(1, falloff * falloff * blackHole.intensity * 2.2)
            const angle = Math.atan2(dy, dx)
            // Swirl: pull inward while also rotating around the hole, so
            // stars spiral in instead of falling straight down the well.
            const swirl = t * 1.5
            const pullDist = Math.min(dist * 0.92, dist * t * 1.1)
            const tx = Math.cos(angle + swirl) * pullDist
            const ty = Math.sin(angle + swirl) * pullDist
            const stretch = 1 + t * 2.5 // spaghettification toward the hole
            transform += ` translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${((angle * 180) / Math.PI).toFixed(1)}deg) scale(${stretch.toFixed(2)}, ${Math.max(0.1, 1 - t * 0.9).toFixed(2)})`
            if (t > 0.25) {
              filter = `drop-shadow(0 0 ${(t * 5).toFixed(1)}px rgba(242, 201, 76, ${(t * 0.8).toFixed(2)}))`
            }
          }
        }

        return (
          <span
            key={i}
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay.toFixed(2)}s`,
              animationDuration: `${star.duration.toFixed(2)}s`,
              transform: transform || undefined,
              filter: filter || undefined,
            }}
          />
        )
      })}
    </div>
  )
}
