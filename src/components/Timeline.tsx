import { useEffect, useRef } from 'react'
import type { SceneNode } from '../scene/sceneData'
import './Timeline.css'

// Flavor distances between consecutive tracks, in light years — the
// wormhole cut and the nebula read as long hauls, the final approach
// home compresses, echoing the atmosphere thickening toward the end.
const LY_GAPS = [42.6, 128.3, 7.4, 316.0, 54.2, 19.8, 2.1]

const GAP_MIN = 56
const GAP_MAX = 220
const GAP_PER_LY = 0.55
const GAP_BASE = 40

function gapPx(ly: number) {
  return Math.min(GAP_MAX, Math.max(GAP_MIN, GAP_BASE + ly * GAP_PER_LY))
}

interface TimelineProps {
  nodes: SceneNode[]
  currentIndex: number
  onSelect: (index: number) => void
}

export default function Timeline({ nodes, currentIndex, onSelect }: TimelineProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [currentIndex])

  return (
    <nav className="timeline-rail" aria-label="Track timeline">
      <div className="timeline-track">
        <div className="timeline-line" />
        {nodes.map((node, i) => {
          const isActive = i === currentIndex
          return (
            <div className="timeline-item" key={node.id}>
              {i > 0 && (
                <div className="timeline-gap" style={{ height: gapPx(LY_GAPS[i - 1]) }}>
                  <span className="timeline-ly">{LY_GAPS[i - 1].toFixed(1)} ly</span>
                </div>
              )}
              <div className="timeline-row">
                <span className={`timeline-label${isActive ? ' active' : ''}`}>
                  {String(node.index + 1).padStart(2, '0')} · {node.title}
                </span>
                <button
                  ref={isActive ? activeRef : undefined}
                  className={`timeline-dot${isActive ? ' active' : ''}`}
                  onClick={() => onSelect(i)}
                  aria-label={`Go to ${node.title}`}
                  aria-current={isActive}
                >
                  <span className="timeline-dot-core" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
