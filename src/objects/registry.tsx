import type { ComponentType } from 'react'
import DefaultObject from './DefaultObject'
import FailingTrampolinePlaceholder from './FailingTrampolinePlaceholder'
import Rickshaw from './Rickshaw'

export interface SceneObjectProps {
  size: number
  seed: number
}

// Maps track.object_key to the component that renders it in the field.
// Phase 4: swap remaining placeholder entries for real layered-SVG
// objects (chai cup, frozen radio, cigarette, ...) one at a time —
// the field/scene logic never needs to change.
export const OBJECT_REGISTRY: Record<string, ComponentType<SceneObjectProps>> = {
  rickshaw: Rickshaw,
  failing_trampoline: FailingTrampolinePlaceholder,
  _default: DefaultObject,
}

export function getObjectComponent(objectKey: string): ComponentType<SceneObjectProps> {
  return OBJECT_REGISTRY[objectKey] ?? OBJECT_REGISTRY._default
}
