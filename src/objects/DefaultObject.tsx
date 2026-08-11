import Placeholder from './Placeholder'

export default function DefaultObject({ size, seed }: { size: number; seed: number }) {
  return <Placeholder color="#4a3f7a" glow="#8e7cc3" size={size} seed={seed} />
}
