import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import Placeholder from '../objects/Placeholder'
import { getObjectVisual } from '../objects/registry'
import type { SceneNode } from './sceneData'

const PARALLAX_RANGE = 220 // px of extra travel for the nearest node

interface NodeProps {
  node: SceneNode
  fieldWidth: number
  scrollYProgress: MotionValue<number>
}

export default function Node({ node, fieldWidth, scrollYProgress }: NodeProps) {
  const reduceMotion = useReducedMotion()
  const visual = getObjectVisual(node.objectKey)

  const range = reduceMotion ? 0 : PARALLAX_RANGE * (1 - node.depth)
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -range])

  const scale = 1.2 - node.depth * 0.7 // near ~1.2, far ~0.5
  const blur = node.depth * 5 // near 0px, far ~5px
  const opacity = 1 - node.depth * 0.4 // near 1, far ~0.6
  const size = 150 - node.depth * 90

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${node.x * fieldWidth - size / 2}px`,
        top: node.y,
        y: parallaxY,
        filter: `blur(${blur}px)`,
        opacity,
        zIndex: Math.round((1 - node.depth) * 100),
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ transform: `scale(${scale})` }}>
          <Placeholder color={visual.color} glow={visual.glow} size={size} seed={node.index} />
        </div>
        <div className="node-label">
          <span className="node-no">{String(node.index + 1).padStart(2, '0')}</span>
          <span className="node-title">{node.title}</span>
        </div>
      </div>
    </motion.div>
  )
}
