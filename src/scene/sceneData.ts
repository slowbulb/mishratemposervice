import { SEED_TRACKS } from '../data/seed'

export type EnvironmentEffect = 'wormhole' | 'nebula' | 'storm'

export interface SceneNode {
  id: string
  index: number
  title: string
  x: number // 0..1, horizontal position within the field
  y: number // px, natural vertical position along the flight path
  depth: number // 0 (near/large/fast) .. 1 (far/small/slow)
  objectKey: string
  headingDeg: number // rotation so the object points toward the next node
  effect?: EnvironmentEffect
}

export const SECTION_HEIGHT = 620
export const TOP_PADDING = 260
export const BOTTOM_PADDING = 320

// Reference width used only to keep x (a 0..1 fraction) and y (px) in
// comparable units when computing heading angles. Doesn't need to track
// the real responsive field width — it's a stylistic heading, not layout.
const HEADING_REFERENCE_WIDTH = 640

// Deterministic depth + horizontal wander per node, hand-tuned for
// variety rather than derived.
const DEPTHS = [0.15, 0.5, 0.8, 0.35, 0.65, 0.2, 0.55, 0.1]
const X_POS = [0.6, 0.3, 0.68, 0.25, 0.55, 0.35, 0.65, 0.4]

const EFFECTS: Record<string, EnvironmentEffect> = {
  'trk-u-turn': 'wormhole',
  'trk-end-is-near': 'nebula',
  'trk-fg-dying': 'storm',
}

function headingBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = (b.x - a.x) * HEADING_REFERENCE_WIDTH
  const dy = b.y - a.y
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

const rawNodes = SEED_TRACKS.map((track, i) => ({
  id: track.id,
  index: i,
  title: track.title,
  x: X_POS[i % X_POS.length],
  y: TOP_PADDING + i * SECTION_HEIGHT,
  depth: DEPTHS[i % DEPTHS.length],
  objectKey: track.objectKey ?? '_default',
  effect: EFFECTS[track.id],
}))

export const SCENE_NODES: SceneNode[] = rawNodes.map((node, i) => {
  const next = rawNodes[i + 1]
  const prev = rawNodes[i - 1]
  const heading = next ? headingBetween(node, next) : prev ? headingBetween(prev, node) : 90
  return { ...node, headingDeg: heading }
})

export const SCENE_HEIGHT =
  TOP_PADDING + (SCENE_NODES.length - 1) * SECTION_HEIGHT + BOTTOM_PADDING
