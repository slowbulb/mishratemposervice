import { Link } from 'react-router-dom'
import Starfield from '../components/Starfield'
import { PRESETS, SEED_ALBUM, SEED_TRACKS } from '../data/seed'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <Starfield />
      <header className="home-header">
        <div className="eyebrow">
          Flight log · {SEED_TRACKS.length} tracks
        </div>
        <h1 className="album-title">{SEED_ALBUM.title}</h1>
        <div className="artist">{SEED_ALBUM.artist}</div>
      </header>

      <main className="track-list">
        {PRESETS.B.map((id, i) => {
          const track = SEED_TRACKS.find((t) => t.id === id)
          if (!track) return null
          return (
            <article key={track.id} className="track-card">
              <div className="track-no">{String(i + 1).padStart(2, '0')}</div>
              <h2 className="track-title">{track.title}</h2>
            </article>
          )
        })}
      </main>

      <footer className="home-footer">
        <Link className="btn" to="/login">
          Owner login
        </Link>
      </footer>
    </div>
  )
}
