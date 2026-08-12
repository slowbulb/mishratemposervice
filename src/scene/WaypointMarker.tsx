import type { SceneNode } from './sceneData'
import './WaypointMarker.css'

interface WaypointMarkerProps {
  node: SceneNode
  distance: number // hops from the current node
  fieldWidth: number
}

// A dim marker for a track the rickshaw isn't currently at. The active
// node instead shows the one real Rickshaw (rendered separately, fixed
// in the viewport). Only the dot itself fades/shrinks/blurs with
// distance — the title stays sharp and fully legible so the tracklist
// reads clearly along the whole path.
export default function WaypointMarker({ node, distance, fieldWidth }: WaypointMarkerProps) {
  const dotScale = Math.max(0.4, 1 - distance * 0.16)
  const dotBlur = Math.min(6, distance * 1.3)
  const dotOpacity = Math.max(0.3, 1 - distance * 0.14)

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x * fieldWidth,
        top: node.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="waypoint">
        <div
          className="waypoint-dot"
          style={{
            transform: `scale(${dotScale})`,
            filter: `blur(${dotBlur}px)`,
            opacity: dotOpacity,
          }}
        />
        <div className="node-label">
          <span className="node-no">{String(node.index + 1).padStart(2, '0')}</span>
          <span className="node-title">{node.title}</span>
        </div>
      </div>
    </div>
  )
}
