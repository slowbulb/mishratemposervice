export interface SeedTrack {
  id: string
  title: string
  prose: string
  objectKey?: string
  audioUrl?: string
}

export const SEED_ALBUM = {
  title: 'Untitled Concept Album — Act I',
  artist: 'Mishra Tempo Service',
}

// Flight order = array order. Every track currently rides the same
// rickshaw object (Phase 4); prose is left blank until lyrics are added
// via the editor (Phase 2).
export const SEED_TRACKS: SeedTrack[] = [
  { id: 'trk-space-supplies', title: 'SPACE SUPPLIES', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-u-turn', title: 'U TURN', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-goodbye', title: 'GOODBYE', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-this-is-april', title: 'THIS IS APRIL', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-end-is-near', title: 'THE END IS NEAR', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-fg-dying', title: 'F*****G DYING', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-escape-sequence', title: 'ESCAPE SEQUENCE', prose: '', objectKey: 'rickshaw' },
  { id: 'trk-immigrant', title: 'IMMIGRANT', prose: '', objectKey: 'rickshaw' },
]
