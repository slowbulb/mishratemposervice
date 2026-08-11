// Per-track mouse-reactive effects for the distant galaxy elements
// (starfield). Only active while that track is the current one AND
// audio is playing. Add more tracks here to give them their own effect
// without touching the components that render them.
export type TrackInteraction =
  | { kind: 'twinkle'; radius: number }
  | { kind: 'blackhole'; captureRadius: number }

export const TRACK_INTERACTIONS: Record<string, TrackInteraction> = {
  'trk-goodbye': { kind: 'twinkle', radius: 140 },
  'trk-end-is-near': { kind: 'blackhole', captureRadius: 90 },
}
