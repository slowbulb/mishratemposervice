import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import FlightField from '../scene/FlightField'
import SocialLinks from '../components/SocialLinks'
import { SEED_ALBUM } from '../data/seed'
import './Home.css'

export default function Home() {
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const [titleWidth, setTitleWidth] = useState<number>()

  // The album title is stretched (via text-align-last: justify) to match
  // the eyebrow's rendered width exactly, so the two mastheads balance
  // the header left/right.
  useLayoutEffect(() => {
    const el = eyebrowRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      setTitleWidth(entries[0].contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-app">
      <header className="home-topbar">
        <div className="home-topbar-text">
          <span className="eyebrow" ref={eyebrowRef}>
            {SEED_ALBUM.artist}
          </span>
          <span className="album-title" style={titleWidth ? { width: titleWidth } : undefined}>
            {SEED_ALBUM.title}
          </span>
        </div>

        <Link className="btn" to="/login">
          Owner login
        </Link>
      </header>

      <FlightField />
      <SocialLinks />
    </div>
  )
}
