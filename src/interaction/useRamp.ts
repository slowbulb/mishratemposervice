import { useEffect, useRef, useState } from 'react'

// Eases a 0..1 value toward `target` over time, so effects spin up and
// wind down smoothly instead of popping on the first pointer event.
export function useRamp(target: number, rampSeconds = 1.6) {
  const [value, setValue] = useState(0)
  const targetRef = useRef(target)
  targetRef.current = target

  useEffect(() => {
    let raf = 0
    let last = performance.now()

    function tick(now: number) {
      const dt = (now - last) / 1000
      last = now
      setValue((v) => {
        const goal = targetRef.current
        const rate = dt / rampSeconds
        if (Math.abs(goal - v) < 0.005) return goal
        return v + (goal - v) * Math.min(1, rate * 4)
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [rampSeconds])

  return value
}
