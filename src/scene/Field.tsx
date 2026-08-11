import { useRef, useState, useLayoutEffect } from 'react'
import { useScroll } from 'framer-motion'
import FlightPath from './FlightPath'
import Node from './Node'
import { SCENE_HEIGHT, SCENE_NODES } from './sceneData'
import './Field.css'

export default function Field() {
  const fieldRef = useRef<HTMLDivElement>(null)
  const [fieldWidth, setFieldWidth] = useState(560)

  useLayoutEffect(() => {
    const el = fieldRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setFieldWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: fieldRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={fieldRef} className="field" style={{ height: SCENE_HEIGHT }}>
      <FlightPath nodes={SCENE_NODES} width={fieldWidth} height={SCENE_HEIGHT} />
      {SCENE_NODES.map((node) => (
        <Node key={node.id} node={node} fieldWidth={fieldWidth} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  )
}
