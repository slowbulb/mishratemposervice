import { useEffect, useRef, useState } from 'react'

// Plays whatever track is currently active. Switches src (and tries to
// autoplay, since this only ever runs right after a nav gesture) whenever
// the url changes; falls back to a "blocked" state if the browser refuses
// autoplay, so the UI can prompt for a manual tap.
export function useAudioPlayer(url: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    const audio = audioRef.current

    audio.pause()
    setIsPlaying(false)
    setBlocked(false)

    if (url) {
      audio.src = url
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setBlocked(true))
    }

    return () => {
      audio.pause()
    }
  }, [url])

  function toggle() {
    const audio = audioRef.current
    if (!audio || !url) return
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setBlocked(false)
        })
        .catch(() => setBlocked(true))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return { isPlaying, blocked, toggle, hasAudio: Boolean(url) }
}
