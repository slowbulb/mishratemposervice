import { useMemo } from 'react'
import './BlackHoleCore.css'

interface BlackHoleCoreProps {
  x: number
  y: number
  intensity: number // 0..1, ramps up the longer it stays alive
}

const DEBRIS_COUNT = 14

// A black hole that rides the cursor: dark event horizon, a lensed
// photon ring, a tilted accretion disc, and debris on elliptical orbits
// spiralling inward.
export default function BlackHoleCore({ x, y, intensity }: BlackHoleCoreProps) {
  const debris = useMemo(
    () =>
      Array.from({ length: DEBRIS_COUNT }, (_, i) => ({
        radius: 46 + (i % 5) * 17,
        duration: 1.6 + (i % 6) * 0.42,
        delay: (i * 0.19) % 2.4,
        size: 1.4 + (i % 3) * 0.9,
        tilt: (i % 4) * 28,
      })),
    [],
  )

  const core = 34 + intensity * 26
  const disc = core * 3.1

  return (
    <div className="bh-wrap" style={{ left: x, top: y, opacity: intensity }}>
      <div
        className="bh-disc"
        style={{ width: disc, height: disc * 0.34, animationDuration: `${6 - intensity * 2.5}s` }}
      />
      <div
        className="bh-disc bh-disc-back"
        style={{ width: disc * 0.82, height: disc * 0.26, animationDuration: `${4.4 - intensity * 1.8}s` }}
      />

      <div className="bh-photon-ring" style={{ width: core * 1.32, height: core * 1.32 }} />

      <div className="bh-lens" style={{ width: core * 2.4, height: core * 2.4 }} />

      <div className="bh-core" style={{ width: core, height: core }} />

      {debris.map((d, i) => (
        <div
          key={i}
          className="bh-orbit"
          style={{
            width: d.radius * 2,
            height: d.radius * 2,
            transform: `translate(-50%, -50%) rotateX(72deg) rotateZ(${d.tilt}deg)`,
            animationDuration: `${d.duration}s`,
            animationDelay: `-${d.delay}s`,
          }}
        >
          <span className="bh-debris" style={{ width: d.size, height: d.size }} />
        </div>
      ))}
    </div>
  )
}
