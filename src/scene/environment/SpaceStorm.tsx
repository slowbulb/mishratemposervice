import { motion, useReducedMotion } from 'framer-motion'

interface SpaceStormProps {
  size: number
}

// A turbulent space storm for "F*****G DYING" — churning red-lit cloud,
// flickering lightning, and scattered debris.
export default function SpaceStorm({ size }: SpaceStormProps) {
  const reduceMotion = useReducedMotion()

  const debris = [
    { cx: 60, cy: 70, r: 3 },
    { cx: 180, cy: 50, r: 2.4 },
    { cx: 40, cy: 160, r: 2 },
    { cx: 200, cy: 180, r: 2.8 },
    { cx: 90, cy: 200, r: 2 },
    { cx: 150, cy: 130, r: 1.8 },
  ]

  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
      <defs>
        <filter id="storm-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <motion.ellipse
        cx="120"
        cy="120"
        rx="115"
        ry="85"
        fill="rgba(181,56,74,0.22)"
        filter="url(#storm-blur)"
        animate={reduceMotion ? undefined : { rx: [110, 122, 110], opacity: [0.6, 0.85, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="130"
        cy="110"
        rx="80"
        ry="55"
        fill="rgba(122,37,54,0.3)"
        filter="url(#storm-blur)"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        style={{ transformOrigin: '130px 110px' }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      <motion.path
        d="M70 40 L100 110 L78 112 L118 200"
        stroke="#ffd968"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduceMotion ? undefined : { opacity: [0, 0, 1, 0, 0.7, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', times: [0, 0.3, 0.35, 0.45, 0.5, 0.6] }}
      />
      <motion.path
        d="M175 30 L150 95 L172 98 L138 175"
        stroke="#7fd1e8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={reduceMotion ? undefined : { opacity: [0, 1, 0, 0, 0.6, 0] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: 'easeOut', delay: 0.8, times: [0, 0.06, 0.12, 0.5, 0.55, 0.65] }}
      />

      {debris.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill="#dde6ff"
          animate={
            reduceMotion
              ? undefined
              : { cx: [d.cx, d.cx + 14, d.cx - 10, d.cx], cy: [d.cy, d.cy - 8, d.cy + 12, d.cy], opacity: [0.3, 0.9, 0.3] }
          }
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}
    </svg>
  )
}
