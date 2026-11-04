import type { AudioVersion, Track } from '@/types'

export function getPreferredAudioVersion(track: Pick<Track, 'audioVersions'>): AudioVersion | undefined {
  return track.audioVersions?.find(version => version.type === 'master' && version.path)
    ?? track.audioVersions?.find(version => version.type === 'mix' && version.path)
}
