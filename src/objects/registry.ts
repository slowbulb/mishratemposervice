export interface ObjectVisual {
  color: string
  glow: string
}

// Every entry renders via Placeholder (Phase 3). Phase 4 swaps individual
// keys for real layered-SVG components (Rickshaw.tsx etc.) without
// touching the field/scene logic.
export const OBJECT_REGISTRY: Record<string, ObjectVisual> = {
  rickshaw: { color: '#b5384a', glow: '#f2c94c' },
  failing_trampoline: { color: '#1f6f7a', glow: '#7fd1e8' },
  _default: { color: '#4a3f7a', glow: '#8e7cc3' },
}

export function getObjectVisual(objectKey: string): ObjectVisual {
  return OBJECT_REGISTRY[objectKey] ?? OBJECT_REGISTRY._default
}
