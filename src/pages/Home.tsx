import { Link } from 'react-router-dom'
import Starfield from '../components/Starfield'
import Field from '../scene/Field'
import { SEED_ALBUM, SEED_TRACKS } from '../data/seed'
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

      <Field />

      <footer className="home-footer">
        <Link className="btn" to="/login">
          Owner login
        </Link>
      </footer>
    </div>
  )
}
