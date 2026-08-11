import Starfield from '../components/Starfield'

export default function EditPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1, padding: 48, textAlign: 'center' }}>
      <Starfield />
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>
        Owner editing view — coming in Phase 1 (auth) and Phase 2 (editing).
      </p>
    </div>
  )
}
