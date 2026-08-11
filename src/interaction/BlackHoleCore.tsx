import './BlackHoleCore.css'

interface BlackHoleCoreProps {
  x: number
  y: number
  proximity: number // 0..1
}

// The visible black hole itself — a dark core with a spinning accretion
// ring, hidden until the pointer gets close to its (undisclosed) target.
export default function BlackHoleCore({ x, y, proximity }: BlackHoleCoreProps) {
  if (proximity <= 0.02) return null

  const size = 20 + proximity * 90

  return (
    <div
      className="blackhole-wrap"
      style={{ left: x, top: y, opacity: Math.min(1, proximity * 1.3) }}
    >
      <div
        className="blackhole-ring"
        style={{ width: size * 1.7, height: size * 1.7 }}
      />
      <div
        className="blackhole-core"
        style={{
          width: size,
          height: size,
          boxShadow: `0 0 ${(size * 0.8).toFixed(0)}px rgba(0, 0, 0, 0.9), 0 0 ${(size * 1.6).toFixed(0)}px rgba(142, 124, 195, ${(0.5 * proximity).toFixed(2)})`,
        }}
      />
    </div>
  )
}
