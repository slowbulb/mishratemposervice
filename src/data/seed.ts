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
  {
    id: 'trk-space-supplies',
    title: 'SPACE SUPPLIES',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/SPACE SUPPLIES vox-1.mp3',
  },
  {
    id: 'trk-u-turn',
    title: 'U TURN',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/U TURN.mp3',
  },
  {
    id: 'trk-goodbye',
    title: 'GOODBYE',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/goodbye p-1.mp3',
  },
  {
    id: 'trk-this-is-april',
    title: 'THIS IS APRIL',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/2. This is april.mp3',
  },
  {
    id: 'trk-end-is-near',
    title: 'THE END IS NEAR',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/the end is near-vox1.mp3',
  },
  {
    id: 'trk-fg-dying',
    title: 'F*****G DYING',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/fucking dying K 9 aug.mp3',
  },
  {
    id: 'trk-escape-sequence',
    title: 'ESCAPE SEQUENCE',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/ESCAPE SEQUENCE 1mp3.mp3',
  },
  {
    id: 'trk-immigrant',
    title: 'IMMIGRANT',
    prose: '',
    objectKey: 'rickshaw',
    audioUrl: '/audio/IMMIGRANT.mp3',
  },
]
