'use client'

import { useState, useEffect } from 'react'
import { Music2, FileText, Clock, MoreHorizontal, ListMusic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { useFileOperations } from '@/hooks/useAlbumOperations'

interface TrackRowProps {
  track: import('@/types').Track
  index: number
  projectColor: string
  albumCover?: string | null
  onOpen: () => void
  onEdit?: () => void
  onDelete?: () => void
  onContextMenu?: (e: React.MouseEvent) => void
  onAddToPlaylist?: () => void
}

export function TrackRow({ track, index, projectColor, albumCover, onOpen, onEdit, onDelete, onContextMenu, onAddToPlaylist }: TrackRowProps) {
  // Satisfy unused param linter
  void onEdit; void onDelete;
  const { getLocalUrl } = useFileOperations()
  const status = TRACK_STATUSES[track.status]
  const hasAudio = track.audioVersions && track.audioVersions.length > 0
  const [coverSrc, setCoverSrc] = useState<string | null>(null)
  const [audioDuration, setAudioDuration] = useState<string>('--:--')
  const [audioSize, setAudioSize] = useState<string>('-- KB')
  const [audioExt, setAudioExt] = useState<string>('')

  useEffect(() => {
    if (albumCover) {
      if (albumCover.startsWith('data:')) {
        setCoverSrc(albumCover)
      } else {
        getLocalUrl(albumCover).then(setCoverSrc)
      }
    } else {
      setCoverSrc(null)
    }
  }, [albumCover, getLocalUrl])

  useEffect(() => {
    if (hasAudio && track.audioVersions && track.audioVersions[0]?.path) {
      const audioPath = track.audioVersions[0].path
      const ext = audioPath.split('.').pop()?.toUpperCase() || ''
      setAudioExt(ext)

      window.electronAPI?.getAudioMetadata(audioPath).then((result) => {
        if (result) {
          if (result.duration) {
            const minutes = Math.floor(result.duration / 60)
            const seconds = Math.floor(result.duration % 60)
            setAudioDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`)
          }
          if (result.size) {
            const kb = Math.round(result.size / 1024)
            setAudioSize(kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`)
          }
        }
      }).catch(() => {})
    }
  }, [hasAudio, track.audioVersions])

  const trackNumber = track.number || index

  return (
    <div
      onClick={onOpen}
      onContextMenu={onContextMenu}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-900/40 border border-neutral-800 cursor-pointer",
        "hover:border-neutral-700 hover:bg-neutral-900/60 transition-colors duration-150 text-left"
      )}
      style={{ borderColor: projectColor + '30' }}
    >
      {/* Album Cover - smaller */}
      <div className="w-8 h-8 rounded flex-shrink-0 overflow-hidden bg-neutral-800 relative">
        {coverSrc ? (
          <img src={coverSrc} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 className="w-4 h-4 text-neutral-500" />
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate text-sm">{trackNumber}. {track.title}</h4>
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-0.5">
          {track.bpm && <span className="flex items-center gap-0.5 whitespace-nowrap"><Music2 className="w-2.5 h-2.5" />{track.bpm} BPM</span>}
          {track.key && <span className="flex items-center gap-0.5 whitespace-nowrap">🎹 {track.key}</span>}
          <span className="flex items-center gap-0.5 whitespace-nowrap"><Clock className="w-2.5 h-2.5" />{audioDuration}</span>
          <span className="flex items-center gap-0.5 whitespace-nowrap"><FileText className="w-2.5 h-2.5" />{audioSize}</span>
          {audioExt && <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[9px] font-mono">{audioExt}</span>}
        </div>
      </div>

      {/* Status badge - compact */}
      <span className={cn(
        "px-2 py-0.5 rounded text-[9px] font-medium uppercase tracking-wide flex items-center gap-1 flex-shrink-0",
        `bg-${status.color}-500/15 text-${status.color}-400 border border-${status.color}-500/20`
      ).replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')}>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: status.color }} />
        {status.label.split(' ')[1]}
      </span>

      {/* Add to Playlist button - visible on hover or if has audio */}
      {onAddToPlaylist && track.audioVersions?.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddToPlaylist() }}
          className="w-7 h-7 rounded bg-white/5 hover:bg-emerald-600/20 flex items-center justify-center text-neutral-500 hover:text-emerald-400 transition-colors flex-shrink-0 ml-1"
          title="Adicionar à Playlist"
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Context menu button */}
      {onContextMenu && (
        <button
          onClick={(e) => { e.stopPropagation(); onContextMenu(e) }}
          className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-white transition-colors flex-shrink-0 ml-1"
          title="Mais opções"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}