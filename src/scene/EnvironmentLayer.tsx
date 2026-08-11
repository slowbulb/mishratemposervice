import Wormhole from './environment/Wormhole'
import GiantNebula from './environment/GiantNebula'
import SpaceStorm from './environment/SpaceStorm'
import ForestLanding from './environment/ForestLanding'
import AtmosphereGradient from './environment/AtmosphereGradient'
import type { SceneNode } from './sceneData'

interface EnvironmentLayerProps {
  nodes: SceneNode[]
  fieldWidth: number
}

export default function EnvironmentLayer({ nodes, fieldWidth }: EnvironmentLayerProps) {
  const byId = new Map(nodes.map((n) => [n.id, n]))

  const uTurn = byId.get('trk-u-turn')
  const goodbye = byId.get('trk-goodbye')
  const endIsNear = byId.get('trk-end-is-near')
  const storm = byId.get('trk-fg-dying')
  const escape = byId.get('trk-escape-sequence')
  const immigrant = byId.get('trk-immigrant')

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
      {/* re-entry: atmosphere thickens from the second-to-last leg down
          to the landing site */}
      {escape && immigrant && (
        <AtmosphereGradient width={fieldWidth} startY={escape.y - 200} endY={immigrant.y + 120} />
      )}

      {immigrant && (
        <div style={{ position: 'absolute', left: 0, top: immigrant.y - 200, width: fieldWidth, height: 620 }}>
          <ForestLanding width={fieldWidth} />
        </div>
      )}

      {uTurn && goodbye && (
        <div
          style={{
            position: 'absolute',
            left: ((uTurn.x + goodbye.x) / 2) * fieldWidth,
            top: (uTurn.y + goodbye.y) / 2,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Wormhole size={170} rotationDeg={uTurn.headingDeg} />
        </div>
      )}

      {endIsNear && (
        <div
          style={{
            position: 'absolute',
            left: endIsNear.x * fieldWidth,
            top: endIsNear.y - 60,
            transform: 'translate(-50%, -35%)',
          }}
        >
          <GiantNebula size={420} />
        </div>
      )}

      {storm && (
        <div
          style={{
            position: 'absolute',
            left: storm.x * fieldWidth,
            top: storm.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SpaceStorm size={320} />
        </div>
      )}
    </div>
  )
}
