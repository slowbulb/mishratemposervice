import Starfield from '../components/Starfield'

export default function LoginPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1, padding: 48, textAlign: 'center' }}>
      <Starfield />
      <p style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>
        Owner login — coming in Phase 1 (Supabase auth).
      </p>
    </div>
  )
}
