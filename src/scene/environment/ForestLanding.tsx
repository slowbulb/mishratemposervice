import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ForestLandingProps {
  width: number
}

const SCENE_HEIGHT = 620
const GROUND_Y = 560

// Journey's end: the atmosphere thickens into real sky, a conifer forest
// rises, and a giant lies on its side among the trees — back to us,
// shoulder above the treetops — with the rickshaw finally at rest.
export default function ForestLanding({ width }: ForestLandingProps) {
  const reduceMotion = useReducedMotion()
  // Overscan well past the viewport so no hard edge shows while the
  // camera pans; the world layer is only as wide as the field.
  const w = Math.max(width, 480) * 2.4
  const offsetX = -(w - Math.max(width, 480)) / 2

  const treeRows = useMemo(() => {
    const rows = [
      { count: 40, height: 120, color: '#0d2a26', opacity: 0.5, blur: 3, yOffset: -60 },
      { count: 34, height: 170, color: '#10352e', opacity: 0.72, blur: 1.5, yOffset: -20 },
      { count: 28, height: 230, color: '#153f36', opacity: 1, blur: 0, yOffset: 20 },
    ]
    return rows.map((row, r) => ({
      ...row,
      trees: Array.from({ length: row.count }, (_, i) => {
        const jitter = ((i * 37 + r * 91) % 100) / 100
        return {
          x: (i / row.count) * w + jitter * 26,
          height: row.height * (0.72 + jitter * 0.5),
          halfWidth: 15 + jitter * 11,
        }
      }),
    }))
  }, [w])

  // The giant is centred left of the landing site so its shoulder and
  // head fall inside the viewport when the camera settles on IMMIGRANT.
  const cx = w / 2 - Math.max(width, 480) * 0.3

  return (
    <div style={{ position: 'absolute', left: offsetX, top: 0, width: w, height: SCENE_HEIGHT, pointerEvents: 'none' }}>
      {/* sky deepening toward the ground */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(46,127,143,0.12) 26%, rgba(28,86,80,0.38) 56%, rgba(10,32,29,0.9) 100%)',
        }}
      />
      {/* horizon glow behind the treeline */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 300,
          width: w * 0.7,
          height: 240,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(242,201,76,0.14), transparent 70%)',
          filter: 'blur(26px)',
        }}
      />

      <svg width={w} height={SCENE_HEIGHT} style={{ position: 'absolute', inset: 0 }}>
        {/* far tree row, behind the giant */}
        <g opacity={treeRows[0].opacity} filter={`blur(${treeRows[0].blur}px)`}>
          {treeRows[0].trees.map((t, i) => (
            <polygon
              key={i}
              points={`${t.x},${GROUND_Y + treeRows[0].yOffset - t.height} ${t.x - t.halfWidth},${GROUND_Y + treeRows[0].yOffset} ${t.x + t.halfWidth},${GROUND_Y + treeRows[0].yOffset}`}
              fill={treeRows[0].color}
            />
          ))}
        </g>

        {/* ——— the resting giant, lying on its side, back toward us ———
             Scaled up and lifted so the shoulder crest clears the
             conifer tops rather than sitting inside the treeline. */}
        <g transform={`translate(0 -96) scale(1.18) translate(0 ${(SCENE_HEIGHT * (1 / 1.18 - 1)).toFixed(1)})`}>
          {/* legs, bent, receding to the left */}
          <path
            d={`M${cx - 430} 545 C ${cx - 400} 505, ${cx - 330} 500, ${cx - 300} 520
                C ${cx - 270} 540, ${cx - 250} 545, ${cx - 235} 545 Z`}
            fill="#0f332c"
          />
          <path
            d={`M${cx - 330} 545 C ${cx - 300} 495, ${cx - 220} 486, ${cx - 170} 512
                C ${cx - 140} 528, ${cx - 120} 542, ${cx - 110} 545 Z`}
            fill="#123a31"
          />

          {/* hip / haunch — a big rounded mass */}
          <ellipse cx={cx - 150} cy={505} rx={125} ry={72} fill="#14423a" />

          {/* the long back: hip up to shoulder, the scene's main ridge */}
          <path
            d={`M${cx - 250} 545
                C ${cx - 250} 470, ${cx - 190} 430, ${cx - 90} 410
                C ${cx + 30} 386, ${cx + 120} 372, ${cx + 175} 352
                L ${cx + 250} 545 Z`}
            fill="#17493f"
          />

          {/* shoulder crest — the tallest point, clearing the conifers */}
          <path
            d={`M${cx + 95} 392
                C ${cx + 120} 300, ${cx + 235} 292, ${cx + 262} 372
                C ${cx + 274} 410, ${cx + 262} 470, ${cx + 252} 545
                L ${cx + 150} 545 Z`}
            fill="#1b5a4c"
          />

          {/* upper arm draping forward over the body, hand toward the trees */}
          <path
            d={`M${cx + 150} 392 C ${cx + 120} 452, ${cx + 30} 486, ${cx - 70} 500`}
            fill="none"
            stroke="#123a31"
            strokeWidth="62"
            strokeLinecap="round"
          />
          {/* forearm + hand resting on the ground */}
          <path
            d={`M${cx - 70} 500 C ${cx - 130} 512, ${cx - 175} 528, ${cx - 200} 540`}
            fill="none"
            stroke="#0f332c"
            strokeWidth="44"
            strokeLinecap="round"
          />

          {/* neck into the head, lying on its side facing away */}
          <path
            d={`M${cx + 235} 330 C ${cx + 262} 300, ${cx + 300} 300, ${cx + 318} 322`}
            fill="none"
            stroke="#1b5a4c"
            strokeWidth="52"
            strokeLinecap="round"
          />
          <ellipse cx={cx + 352} cy={332} rx={62} ry={54} fill="#17493f" />
          {/* hair/moss mass on the back of the skull */}
          <path
            d={`M${cx + 312} 300 C ${cx + 330} 268, ${cx + 392} 268, ${cx + 408} 306
                C ${cx + 418} 330, ${cx + 410} 352, ${cx + 400} 360
                C ${cx + 380} 322, ${cx + 340} 306, ${cx + 312} 300 Z`}
            fill="#0f332c"
          />

          {/* rim light along the back ridge, moonlight catching the edge */}
          <path
            d={`M${cx - 250} 540
                C ${cx - 250} 468, ${cx - 190} 428, ${cx - 90} 408
                C ${cx + 30} 384, ${cx + 118} 370, ${cx + 168} 350`}
            fill="none"
            stroke="rgba(127,209,232,0.4)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={`M${cx + 100} 388 C ${cx + 124} 300, ${cx + 234} 293, ${cx + 260} 370`}
            fill="none"
            stroke="rgba(127,209,232,0.55)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* slow breathing motes rising off the back */}
          {!reduceMotion &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.circle
                key={i}
                cx={cx - 60 + i * 70}
                cy={400 - i * 6}
                r={2.2}
                fill="#7fd1e8"
                animate={{ cy: [400 - i * 6, 320 - i * 6], opacity: [0, 0.65, 0] }}
                transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeOut', delay: i * 1.5 }}
              />
            ))}
        </g>

        {/* mid + near tree rows, drawn over the giant so it sits among them */}
        {treeRows.slice(1).map((row, ri) => (
          <g key={ri} opacity={row.opacity} filter={row.blur ? `blur(${row.blur}px)` : undefined}>
            {row.trees.map((t, i) => (
              <polygon
                key={i}
                points={`${t.x},${GROUND_Y + row.yOffset - t.height} ${t.x - t.halfWidth},${GROUND_Y + row.yOffset} ${t.x + t.halfWidth},${GROUND_Y + row.yOffset}`}
                fill={row.color}
              />
            ))}
          </g>
        ))}

        {/* forest floor */}
        <rect x="0" y={GROUND_Y + 20} width={w} height={SCENE_HEIGHT - GROUND_Y} fill="#081a18" />
      </svg>

      {/* fireflies drifting between the trees */}
      {!reduceMotion &&
        Array.from({ length: 14 }, (_, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              left: `${6 + ((i * 67) % 88)}%`,
              top: 360 + ((i * 53) % 190),
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#f2c94c',
              boxShadow: '0 0 8px rgba(242,201,76,0.9)',
            }}
            animate={{ opacity: [0, 1, 0], y: [0, -20, 0] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.8 }}
          />
        ))}
    </div>
  )
}
