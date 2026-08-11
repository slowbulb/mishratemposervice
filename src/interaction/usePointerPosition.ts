import { useEffect, useState } from 'react'

// Tracks pointer position in viewport (client) coordinates, matching the
// coordinate space of the fixed-position starfield. Only listens while
// `enabled` is true so idle tracks don't pay for a global pointermove
// listener and re-render cascade.
export function usePointerPosition(enabled: boolean) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!enabled) {
      setPos(null)
      return
    }

    let raf = 0
    function onMove(e: PointerEvent) {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }))
    }

    window.addEventListener('pointermove', onMove)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [enabled])

  return pos
}
