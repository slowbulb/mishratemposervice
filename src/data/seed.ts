export interface SeedTrack {
  id: string
  title: string
  prose: string
  objectKey?: string
}

// Ported verbatim from the prototype (concept-album-storyboard.html).
// Do not "correct" lyric content — draft artifacts, brackets, and invented
// words are intentional.
export const SEED_ALBUM = {
  title: 'Untitled Concept Album — Act I',
  artist: 'Mishra Tempo Service',
}

export const SEED_TRACKS: SeedTrack[] = [
  {
    id: 'trk-sea',
    title: 'The Sea Is a Failing Trampoline',
    prose:
      'Come out, come out of the estuary\nO great giant run with me\n\nEveryone that you know\nHas come out for the show\n\nThe sea is a failing trampoline\nJump!',
    objectKey: 'failing_trampoline',
  },
  {
    id: 'trk-morning',
    title: 'Miss the Morning Light',
    prose:
      'Miss the morning light\nMiss the fire on the stove\nMiss the freezing moon\nMiss the winter at its cusp\n\nMiss the morning light\nMiss the fire off the cuff\nMiss the Tolkien moon\n\nMiss the world inside your head\n\nFloating up\nFloating on up\nAs I wave goodbye to thrust\n\nMeet me in the wild\nMeet me in the…\n[What about the paid / what the fuxk is that — unresolved]',
  },
  {
    id: 'trk-mining',
    title: 'Space Mining Our Own Business',
    prose:
      'Freezing out here\nI do not have water\nI do not have space supplies\n\nI do not have a cigarette\nI miss human connection\nI miss your web of lies\n\nBadle ki chingaariyan\nDun antarikh me gaaliyan\n\nWe will settle in the lumpsum baby\nWe\'ll make a lot of money\n\nBadle ki chingaariyan\nDun antarikh me gaaliyan\n\nWe will settle at the tombstone baby\nWe\'ll make a lot of money\n\nJust space mining our own business',
  },
  {
    id: 'trk-station',
    title: "Chillin' Out on a Space Station",
    prose:
      "Chillin' out on a space station\nChillin' out in a cool fashion\nWhen the time comes\nThen we see what's to be done\n\nCrowbar, murder weapon\nUsed to fix the station\nHandy in a situation\nDo not use for computation\n\nChillin' out on the space station\nChilling out, conversation\nLeave me breathless\nThe view leaves us breathless\n\nClose, closer\nIn an ocean\n\n[Something something — still figuring the mumbles]",
  },
  {
    id: 'trk-ghar',
    title: 'Ghar Chalo!',
    prose:
      'Antariksh yaan ko\nU-turn karke\nGhar ki disha me\nKyon nahi chalte\n\nEngine me bhi aag lagi hai\n\nGhar chalo!\nGhar chalo!',
    objectKey: 'rickshaw',
  },
  {
    id: 'trk-andromeda',
    title: 'Andromeda Blush',
    prose:
      'I know my name\nIs blaksshchinchana\nI think my name\nIs blasthuchaih\n\nI fly… lightspeed alone\n\nAndromeda blush\nAndromeda, andromeda blush',
  },
]

// Preset sequences (track ids), ported verbatim.
export const PRESETS = {
  A: ['trk-mining', 'trk-ghar', 'trk-station', 'trk-andromeda', 'trk-morning', 'trk-sea'],
  B: ['trk-sea', 'trk-morning', 'trk-mining', 'trk-station', 'trk-ghar', 'trk-andromeda'],
} as const
