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

function makeStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() < 0.85 ? 1 : 2,
    delay: Math.random() * 6,
    duration: 3 + Math.random() * 5,
  }))
}

export default function Starfield() {
  const stars = useMemo(() => makeStars(STAR_COUNT), [])

  return (
    <div id="sky" aria-hidden="true">
      {stars.map((star, i) => (
        <span
          key={i}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay.toFixed(2)}s`,
            animationDuration: `${star.duration.toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  )
}
