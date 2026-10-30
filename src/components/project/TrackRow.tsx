'use client'

import { useState, useEffect } from 'react'
import { Music2, FileText, Clock, MoreHorizontal, ListMusic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { useFileOperations } from '@/hooks/useAlbumOperations'
import { StatusBadge } from '@/components/ui/Badges'

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
    <button
      onClick={onOpen}
      onContextMenu={onContextMenu}
      className={cn(
        "w-full flex items-center gap-sm px-md py-sm",
        "rounded-lg",
        "bg-subtle border border-subtle cursor-pointer",
        "hover:border-muted hover:bg-hover trans-colors text-left focus-ring"
      )}
      style={{ borderColor: `hsl(var(--color-border-default) / var(--project-color-muted))` }}
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
        <h4 className="font-medium text-primary truncate text-sm">{trackNumber}. {track.title}</h4>
        <div className="flex items-center gap-sm text-caption text-muted mt-xs flex-wrap">
          {track.bpm && <span className="flex items-center gap-xs whitespace-nowrap"><Music2 className="w-3 h-3" />{track.bpm} BPM</span>}
          {track.key && <span className="flex items-center gap-xs whitespace-nowrap">🎹 {track.key}</span>}
          <span className="flex items-center gap-xs whitespace-nowrap"><Clock className="w-3 h-3" />{audioDuration}</span>
          <span className="flex items-center gap-xs whitespace-nowrap"><FileText className="w-3 h-3" />{audioSize}</span>
          {audioExt && <span className="px-xs py-xs rounded bg-neutral-800 text-[9px] font-mono">{audioExt}</span>}
        </div>
      </div>

      {/* Status badge - using unified component */}
      <StatusBadge status={track.status as keyof typeof TRACK_STATUSES} size="sm" />

      {/* Add to Playlist button - visible on hover or if has audio */}
      {onAddToPlaylist && track.audioVersions?.length > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onAddToPlaylist() }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-emerald-600/20 flex items-center justify-center text-neutral-500 hover:text-emerald-400 trans-colors flex-shrink-0 ml-xs focus-ring"
          title="Adicionar à Playlist"
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Context menu button */}
      {onContextMenu && (
        <button
          onClick={(e) => { e.stopPropagation(); onContextMenu(e) }}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-500 hover:text-white trans-colors flex-shrink-0 ml-xs focus-ring"
          title="Mais opções"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      )}
    </button>
  )
}