import type { SceneNode } from './sceneData'

interface FlightPathProps {
  nodes: SceneNode[]
  width: number
  height: number
}

export default function FlightPath({ nodes, width, height }: FlightPathProps) {
  if (nodes.length < 2) return null

  const points = nodes.map((n) => `${n.x * width},${n.y}`).join(' ')

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="rgba(146, 166, 255, 0.35)"
        strokeWidth={1.5}
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
    </svg>
  )
}
