import './NavButtons.css'

interface NavButtonsProps {
  onUp: () => void
  onDown: () => void
  canUp: boolean
  canDown: boolean
}

export default function NavButtons({ onUp, onDown, canUp, canDown }: NavButtonsProps) {
  return (
    <div className="nav-buttons">
      <button className="nav-btn" onClick={onUp} disabled={!canUp} aria-label="Previous track">
        ↑
      </button>
      <button className="nav-btn" onClick={onDown} disabled={!canDown} aria-label="Next track">
        ↓
      </button>
    </div>
  )
}
