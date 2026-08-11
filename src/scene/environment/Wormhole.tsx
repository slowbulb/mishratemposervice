import { motion, useReducedMotion } from 'framer-motion'

interface WormholeProps {
  size: number
  rotationDeg: number
}

// A swirling portal marking the "U TURN" track, oriented to visually
// lead toward the next node on the flight path.
export default function Wormhole({ size, rotationDeg }: WormholeProps) {
  const reduceMotion = useReducedMotion()
  const rings = [0, 1, 2, 3]

  return (
    <div style={{ transform: `rotate(${rotationDeg}deg)` }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="wormhole-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e8ecff" />
            <stop offset="35%" stopColor="#7fd1e8" />
            <stop offset="75%" stopColor="#8e7cc3" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8e7cc3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {rings.map((i) => (
          <motion.ellipse
            key={i}
            cx="100"
            cy="100"
            rx={92 - i * 20}
            ry={30 - i * 5}
            fill="none"
            stroke={i % 2 === 0 ? '#7fd1e8' : '#8e7cc3'}
            strokeWidth={2}
            opacity={0.55 - i * 0.09}
            style={{ transformOrigin: '100px 100px' }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 7 + i * 2.4, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.circle
          cx="100"
          cy="100"
          r="26"
          fill="url(#wormhole-core)"
          animate={reduceMotion ? undefined : { scale: [0.9, 1.08, 0.9], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 100px' }}
        />
      </svg>
    </div>
  )
}
