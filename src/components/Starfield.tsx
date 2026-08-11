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
  proximity: number // 0..1, how close the pointer is to the hidden target
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
          const dist = Math.hypot(px - blackHole.x, py - blackHole.y)
          const influence = blackHole.captureRadius * 3
          if (dist < influence) {
            const t = Math.min(1, (1 - dist / influence) * blackHole.proximity * 1.4)
            const angle = Math.atan2(blackHole.y - py, blackHole.x - px)
            const pullDist = Math.min(dist * 0.7, t * 60)
            transform += ` translate(${(Math.cos(angle) * pullDist).toFixed(1)}px, ${(Math.sin(angle) * pullDist).toFixed(1)}px) scale(${Math.max(0.15, 1 - t * 0.85).toFixed(2)})`
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
