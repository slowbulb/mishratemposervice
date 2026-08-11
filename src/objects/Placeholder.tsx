import { motion, useReducedMotion } from 'framer-motion'

export interface PlaceholderProps {
  color: string
  glow: string
  size: number
  seed: number
}

// Simple glowing shape used for every scene node until real object art
// (layered SVG rickshaw etc., Phase 4) replaces it.
export default function Placeholder({ color, glow, size, seed }: PlaceholderProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      style={{
        width: size,
        height: size,
        borderRadius: '38% 62% 55% 45% / 45% 40% 60% 55%',
        background: `radial-gradient(circle at 35% 30%, ${glow}, ${color} 70%)`,
        boxShadow: `0 0 ${size * 0.6}px ${glow}`,
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -10, 0, 8, 0],
              rotate: [0, 4, 0, -3, 0],
            }
      }
      transition={{
        duration: 7 + (seed % 5),
        repeat: Infinity,
        ease: 'easeInOut',
        delay: (seed % 7) * 0.3,
      }}
    />
  )
}
