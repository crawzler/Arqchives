import type { LyricSyncEntry } from '@/types'

export function splitLyricsIntoLines(lyrics: string): string[] {
  return lyrics
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
}

export function getActiveLyricIndex(sync: LyricSyncEntry[] | undefined, time: number): number {
  if (!sync) return -1

  let activeIndex = -1
  let latestStartTime = -1
  for (let index = 0; index < sync.length; index++) {
    const startTime = sync[index].startTime
    if (startTime !== null && startTime <= time && startTime >= latestStartTime) {
      activeIndex = index
      latestStartTime = startTime
    }
  }
  return activeIndex
}
