import type { ComponentType } from 'react'
import DefaultObject from './DefaultObject'
import Rickshaw from './Rickshaw'

export interface SceneObjectProps {
  size: number
  seed: number
}

// Maps track.object_key to the component that renders it in the field.
// Every current track rides the rickshaw; _default is a fallback for
// any future object_key that doesn't have real art yet.
export const OBJECT_REGISTRY: Record<string, ComponentType<SceneObjectProps>> = {
  rickshaw: Rickshaw,
  _default: DefaultObject,
}

export function getObjectComponent(objectKey: string): ComponentType<SceneObjectProps> {
  return OBJECT_REGISTRY[objectKey] ?? OBJECT_REGISTRY._default
}
