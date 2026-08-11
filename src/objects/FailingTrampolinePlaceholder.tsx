import Placeholder from './Placeholder'

// Placeholder until the failing-trampoline object gets real layered art.
export default function FailingTrampolinePlaceholder({ size, seed }: { size: number; seed: number }) {
  return <Placeholder color="#1f6f7a" glow="#7fd1e8" size={size} seed={seed} />
}
