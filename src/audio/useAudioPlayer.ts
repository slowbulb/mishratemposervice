import { useEffect, useRef, useState } from 'react'

const FADE_MS = 350
const FADE_STEPS = 14
const SNIPPET_RANGE: [number, number] = [0.25, 0.65] // start somewhere in the middle of the track

function randomInRange([min, max]: [number, number]) {
  return min + Math.random() * (max - min)
}

// Plays whatever track is currently active: crossfades out of the
// previous track and into a random mid-track snippet of the next one.
// Falls back to a "blocked" state if the browser refuses autoplay, so
// the UI can prompt for a manual tap.
export function useAudioPlayer(url: string | undefined) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeTimerRef = useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio()
    const audio = audioRef.current
    const wasPlaying = !audio.paused

    function clearFade() {
      if (fadeTimerRef.current !== null) {
        window.clearInterval(fadeTimerRef.current)
        fadeTimerRef.current = null
      }
    }

    function fade(from: number, to: number, onDone?: () => void) {
      clearFade()
      audio.volume = from
      let step = 0
      fadeTimerRef.current = window.setInterval(() => {
        step++
        audio.volume = from + (to - from) * (step / FADE_STEPS)
        if (step >= FADE_STEPS) {
          clearFade()
          audio.volume = to
          onDone?.()
        }
      }, FADE_MS / FADE_STEPS)
    }

    function switchTrack() {
      audio.pause()
      setIsPlaying(false)
      setBlocked(false)
      if (!url) return

      audio.src = url
      audio.volume = 0

      function startFromRandomSnippet() {
        if (audio.duration && isFinite(audio.duration)) {
          audio.currentTime = audio.duration * randomInRange(SNIPPET_RANGE)
        }
        audio
          .play()
          .then(() => {
            setIsPlaying(true)
            fade(0, 1)
          })
          .catch(() => setBlocked(true))
      }

      if (audio.readyState >= 1) {
        startFromRandomSnippet()
      } else {
        audio.addEventListener('loadedmetadata', startFromRandomSnippet, { once: true })
      }
    }

    if (wasPlaying) {
      fade(audio.volume, 0, switchTrack)
    } else {
      switchTrack()
    }

    return () => {
      clearFade()
      audio.pause()
    }
  }, [url])

  function toggle() {
    const audio = audioRef.current
    if (!audio || !url) return
    if (audio.paused) {
      audio.volume = 0
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setBlocked(false)
          let step = 0
          const timer = window.setInterval(() => {
            step++
            audio.volume = step / FADE_STEPS
            if (step >= FADE_STEPS) window.clearInterval(timer)
          }, FADE_MS / FADE_STEPS)
        })
        .catch(() => setBlocked(true))
    } else {
      let step = FADE_STEPS
      const startVolume = audio.volume
      const timer = window.setInterval(() => {
        step--
        audio.volume = startVolume * (step / FADE_STEPS)
        if (step <= 0) {
          window.clearInterval(timer)
          audio.pause()
          setIsPlaying(false)
        }
      }, FADE_MS / FADE_STEPS)
    }
  }

  return { isPlaying, blocked, toggle, hasAudio: Boolean(url) }
}
