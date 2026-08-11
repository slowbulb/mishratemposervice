interface AtmosphereGradientProps {
  width: number
  startY: number
  endY: number
}

// Space thinning into breathable sky: transparent at the top (deep
// space) and progressively denser toward the final waypoint, so the
// approach to IMMIGRANT reads as re-entry rather than a hard cut.
// Overscanned horizontally so no edge shows while the camera pans.
export default function AtmosphereGradient({ width, startY, endY }: AtmosphereGradientProps) {
  const w = width * 2.4
  return (
    <div
      style={{
        position: 'absolute',
        left: -(w - width) / 2,
        top: startY,
        width: w,
        height: endY - startY,
        pointerEvents: 'none',
        background:
          'linear-gradient(180deg, transparent 0%, rgba(46,127,143,0.06) 30%, rgba(46,127,143,0.16) 55%, rgba(38,110,120,0.3) 78%, rgba(20,69,58,0.5) 100%)',
      }}
    />
  )
}
