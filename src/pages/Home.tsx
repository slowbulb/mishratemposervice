import { Link } from 'react-router-dom'
import FlightField from '../scene/FlightField'
import { SEED_ALBUM } from '../data/seed'
import './Home.css'

export default function Home() {
  return (
    <div className="home-app">
      <header className="home-topbar">
        <div className="home-topbar-text">
          <span className="eyebrow">{SEED_ALBUM.artist}</span>
          <span className="mini-title">{SEED_ALBUM.title}</span>
        </div>
        <Link className="btn" to="/login">
          Owner login
        </Link>
      </header>

      <FlightField />
    </div>
  )
}
