import { motion, useReducedMotion } from 'framer-motion'

interface GiantNebulaProps {
  size: number
}

// A cluster nebula, loosely suggesting a colossal humanoid entity
// looming in the dark, for "THE END IS NEAR".
export default function GiantNebula({ size }: GiantNebulaProps) {
  const reduceMotion = useReducedMotion()
  const height = size * 1.5

  return (
    <motion.div
      style={{ position: 'relative', width: size, height }}
      animate={reduceMotion ? undefined : { opacity: [0.55, 0.8, 0.55] }}
      transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* head */}
      <div
        style={{
          position: 'absolute',
          top: '2%',
          left: '36%',
          width: '28%',
          height: '20%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,236,255,0.4), rgba(142,124,195,0.25) 60%, transparent 80%)',
          filter: 'blur(22px)',
        }}
      />
      {/* shoulders / torso */}
      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: '8%',
          width: '84%',
          height: '48%',
          borderRadius: '50% 50% 42% 42%',
          background: 'radial-gradient(ellipse, rgba(181,56,74,0.32), rgba(142,124,195,0.28) 55%, transparent 78%)',
          filter: 'blur(30px)',
        }}
      />
      {/* left arm trailing down */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-6%',
          width: '30%',
          height: '55%',
          borderRadius: '50%',
          transform: 'rotate(-18deg)',
          background: 'radial-gradient(ellipse, rgba(142,124,195,0.28), transparent 75%)',
          filter: 'blur(26px)',
        }}
      />
      {/* right arm trailing down */}
      <div
        style={{
          position: 'absolute',
          top: '32%',
          right: '-8%',
          width: '32%',
          height: '58%',
          borderRadius: '50%',
          transform: 'rotate(16deg)',
          background: 'radial-gradient(ellipse, rgba(142,124,195,0.25), transparent 75%)',
          filter: 'blur(26px)',
        }}
      />
      {/* lower body fading into space dust */}
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '20%',
          width: '60%',
          height: '35%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(46,127,143,0.22), transparent 78%)',
          filter: 'blur(24px)',
        }}
      />
      {/* two faint "eyes" */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '9%',
            left: i === 0 ? '42%' : '52%',
            width: '4%',
            height: '3%',
            borderRadius: '50%',
            background: 'rgba(242,201,76,0.9)',
            filter: 'blur(2px)',
          }}
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 }}
        />
      ))}
    </motion.div>
  )
}
