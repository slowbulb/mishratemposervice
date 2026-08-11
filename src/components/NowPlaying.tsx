import type { SceneNode } from '../scene/sceneData'
import './NowPlaying.css'

interface AudioState {
  isPlaying: boolean
  blocked: boolean
  toggle: () => void
  hasAudio: boolean
}

interface NowPlayingProps {
  node: SceneNode
  total: number
  audio: AudioState
}

export default function NowPlaying({ node, total, audio }: NowPlayingProps) {
  const label = !audio.hasAudio ? 'No audio yet' : audio.blocked ? 'Tap to play' : audio.isPlaying ? 'Pause' : 'Play'

  return (
    <div className="now-playing">
      <div className="now-playing-track">
        <span className="now-playing-no">
          {String(node.index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="now-playing-title">{node.title}</span>
      </div>
      <button className="now-playing-toggle" onClick={audio.toggle} disabled={!audio.hasAudio}>
        {label}
      </button>
    </div>
  )
}
