import { motion, useReducedMotion } from 'framer-motion'

interface RickshawProps {
  size: number
  seed?: number
}

// Layered SVG rickshaw, matching the band's reference art: maroon/red
// tin body, gold roof lights, मिश्रा roof sign, टेम्पो / सर्विस
// windshield banner, and a star-outline ghost passenger in the open
// side cutout. Layers animate independently (wheels spin, body bobs,
// trail streams, lights pulse) per the parallax-rig pattern in the
// build spec (§6).
export default function Rickshaw({ size, seed = 0 }: RickshawProps) {
  const reduceMotion = useReducedMotion()
  const width = size * 1.8
  const height = size * 1.15
  const uid = `rickshaw-${seed}`

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 420 260"
      style={{ overflow: 'visible' }}
      animate={reduceMotion ? undefined : { y: [0, -6, 0, 4, 0], rotate: [0, 1.2, 0, -1, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: (seed % 5) * 0.4 }}
    >
      <defs>
        <radialGradient id={`${uid}-ground`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(242,201,76,0.35)" />
          <stop offset="100%" stopColor="rgba(242,201,76,0)" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="205" cy="235" rx="150" ry="18" fill={`url(#${uid}-ground)`} />

      {/* stardust trail, instead of exhaust */}
      <motion.g
        animate={reduceMotion ? undefined : { opacity: [0.15, 0.6, 0.15], x: [0, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={70 - i * 22}
            cy={196 + (i % 2) * 8}
            r={3.4 - i * 0.4}
            fill="#DDE6FF"
            opacity={0.7 - i * 0.12}
          />
        ))}
      </motion.g>

      {/* far (rear) wheel */}
      <motion.g
        style={{ transformOrigin: '108px 208px' }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="108" cy="208" r="30" fill="#14102a" stroke="#f2c94c" strokeWidth="4" />
        <circle cx="108" cy="208" r="7" fill="#f2c94c" />
        {[0, 60, 120].map((a) => (
          <line
            key={a}
            x1="108"
            y1="208"
            x2={108 + 26 * Math.cos((a * Math.PI) / 180)}
            y2={208 + 26 * Math.sin((a * Math.PI) / 180)}
            stroke="#f2c94c"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}
      </motion.g>

      <g>
        {/* main tin body */}
        <path
          d="M84 192 C84 150, 96 96, 150 88 L300 88 C324 88, 336 108, 336 130 L336 178
             C336 188, 328 194, 318 194 L100 194 C90 194, 84 188, 84 192 Z"
          fill="#b5384a"
          stroke="#14102a"
          strokeWidth="3"
        />

        {/* open side cutout with the ghost passenger, on top of the body */}
        <rect x="96" y="118" width="92" height="74" rx="12" fill="#0c1030" stroke="rgba(146,166,255,0.3)" strokeWidth="1.5" />
        <g stroke="#7fd1e8" strokeWidth="2" fill="none" opacity="0.85" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="126" cy="140" r="11" />
          <path d="M126 151 L132 178 L168 186" />
          <path d="M132 178 L118 186" />
          <path d="M140 158 L118 168" />
          <path d="M140 158 L160 150" />
          <path d="M168 186 L178 180" />
        </g>
        <path d="M145 156 l4 -6 l4 6 l-4 6 z" fill="#b5384a" opacity="0.8" />

        {/* roof canopy */}
        <path d="M140 90 C150 66, 300 66, 316 90 L316 100 L140 100 Z" fill="#7a2536" stroke="#14102a" strokeWidth="3" />

        {/* roof sign */}
        <path d="M188 56 C188 44, 276 44, 276 56 L276 70 L188 70 Z" fill="#0c1030" stroke="#f2c94c" strokeWidth="2" />
        <text x="232" y="66" textAnchor="middle" fontFamily="'Noto Sans Devanagari', system-ui, sans-serif" fontSize="14" fill="#f2c94c" fontWeight="600">
          मिश्रा
        </text>

        {/* roof lights */}
        {[210, 232, 254].map((cx, i) => (
          <motion.circle
            key={cx}
            cx={cx}
            cy="78"
            r="6"
            fill="#f2c94c"
            filter={`url(#${uid}-glow)`}
            animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

        {/* windshield + driver */}
        <rect x="196" y="104" width="110" height="66" rx="8" fill="rgba(20,16,42,0.55)" stroke="#f2c94c" strokeWidth="2" />
        <circle cx="250" cy="128" r="15" fill="#e8ecff" />
        <path d="M234 168 C234 150, 266 150, 266 168 Z" fill="#8e7cc3" />

        {/* tempo service banner */}
        <rect x="196" y="148" width="110" height="36" rx="4" fill="#0c1030" stroke="rgba(242,201,76,0.4)" strokeWidth="1.5" />
        <text x="251" y="163" textAnchor="middle" fontFamily="'Noto Sans Devanagari', system-ui, sans-serif" fontSize="12" fill="#f2c94c" fontWeight="600">
          टेम्पो
        </text>
        <text x="251" y="179" textAnchor="middle" fontFamily="'Noto Sans Devanagari', system-ui, sans-serif" fontSize="12" fill="#f2c94c" fontWeight="600">
          सर्विस
        </text>

        {/* dashboard idol glow */}
        <motion.circle
          cx="210"
          cy="176"
          r="4"
          fill="#f2c94c"
          filter={`url(#${uid}-glow)`}
          animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* headlight, a small star */}
        <motion.path
          d="M338 150 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z"
          fill="#f2c94c"
          filter={`url(#${uid}-glow)`}
          style={{ transformOrigin: '338px 164px' }}
          animate={reduceMotion ? undefined : { opacity: [0.6, 1, 0.6], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>

      {/* front fender */}
      <path d="M300 178 C300 158, 320 150, 336 158 L340 190 C340 198, 330 200, 320 198 Z" fill="#7a2536" stroke="#14102a" strokeWidth="2" />

      {/* near (front) wheel */}
      <motion.g
        style={{ transformOrigin: '300px 210px' }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="300" cy="210" r="36" fill="#14102a" stroke="#f2c94c" strokeWidth="5" />
        <circle cx="300" cy="210" r="8" fill="#f2c94c" />
        {[0, 45, 90, 135].map((a) => (
          <line
            key={a}
            x1="300"
            y1="210"
            x2={300 + 31 * Math.cos((a * Math.PI) / 180)}
            y2={210 + 31 * Math.sin((a * Math.PI) / 180)}
            stroke="#f2c94c"
            strokeWidth="2.2"
            opacity="0.7"
          />
        ))}
      </motion.g>
    </motion.svg>
  )
}
