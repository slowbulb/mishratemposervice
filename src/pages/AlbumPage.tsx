import { useParams } from 'react-router-dom'
import Starfield from '../components/Starfield'

export default function AlbumPage() {
  const { id } = useParams()

  return (
    <div style={{ position: 'relative', zIndex: 1, padding: 48, textAlign: 'center' }}>
      <Starfield />
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>
        Album view for <code>{id}</code> — coming in Phase 2.
      </p>
    </div>
  )
}
