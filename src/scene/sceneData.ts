import { PRESETS, SEED_TRACKS } from '../data/seed'

export interface SceneNode {
  id: string
  index: number
  title: string
  x: number // 0..1, horizontal position within the field
  y: number // px, natural vertical position along the flight path
  depth: number // 0 (near/large/fast) .. 1 (far/small/slow)
  objectKey: string
}

export const SECTION_HEIGHT = 620
export const TOP_PADDING = 260
export const BOTTOM_PADDING = 320

// Deterministic depth + horizontal wander per node, hand-tuned for variety
// rather than derived — six tracks, six fixed positions.
const DEPTHS = [0.15, 0.55, 0.85, 0.3, 0.7, 0.1]
const X_POS = [0.62, 0.28, 0.7, 0.22, 0.6, 0.35]

const order = PRESETS.B
const byId = new Map(SEED_TRACKS.map((t) => [t.id, t]))

export const SCENE_NODES: SceneNode[] = order.map((id, i) => {
  const track = byId.get(id)!
  return {
    id: track.id,
    index: i,
    title: track.title,
    x: X_POS[i % X_POS.length],
    y: TOP_PADDING + i * SECTION_HEIGHT,
    depth: DEPTHS[i % DEPTHS.length],
    objectKey: track.objectKey ?? '_default',
  }
})

export const SCENE_HEIGHT =
  TOP_PADDING + (SCENE_NODES.length - 1) * SECTION_HEIGHT + BOTTOM_PADDING
