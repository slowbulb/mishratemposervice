import type { SceneNode } from './sceneData'
import './WaypointMarker.css'

interface WaypointMarkerProps {
  node: SceneNode
  distance: number // hops from the current node
  fieldWidth: number
}

// A dim marker for a track the rickshaw isn't currently at. The active
// node instead shows the one real Rickshaw (rendered separately, fixed
// in the viewport).
export default function WaypointMarker({ node, distance, fieldWidth }: WaypointMarkerProps) {
  const scale = Math.max(0.4, 1 - distance * 0.16)
  const blur = Math.min(6, distance * 1.3)
  const opacity = Math.max(0.3, 1 - distance * 0.14)

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x * fieldWidth,
        top: node.y,
        transform: 'translate(-50%, -50%)',
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      <div style={{ transform: `scale(${scale})` }} className="waypoint">
        <div className="waypoint-dot" />
        <div className="node-label">
          <span className="node-no">{String(node.index + 1).padStart(2, '0')}</span>
          <span className="node-title">{node.title}</span>
        </div>
      </div>
    </div>
  )
}
