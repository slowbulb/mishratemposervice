import { useCallback, useState } from 'react'
import { SCENE_NODES } from './sceneData'

export function useFlightNav() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const last = SCENE_NODES.length - 1

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(last, i + 1))
  }, [last])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(last, Math.max(0, index)))
    },
    [last],
  )

  return {
    currentIndex,
    currentNode: SCENE_NODES[currentIndex],
    goNext,
    goPrev,
    goTo,
    canGoNext: currentIndex < last,
    canGoPrev: currentIndex > 0,
  }
}
