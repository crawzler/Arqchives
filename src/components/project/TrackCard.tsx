'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music2, FileText, MoreHorizontal, Clock, ListMusic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { useFileOperations } from '@/hooks/useAlbumOperations'
import { StatusBadge } from '@/components/ui/Badges'

interface TrackCardProps {
  track: import('@/types').Track
  index: number
  projectColor: string
  albumCover?: string | null
  onOpen: () => void
  onContextMenu?: (e: React.MouseEvent) => void
  onAddToPlaylist?: () => void
}

export function TrackCard({ track, index, projectColor, albumCover, onOpen, onContextMenu, onAddToPlaylist }: TrackCardProps) {
  const { getLocalUrl } = useFileOperations()
  const hasAudio = track.audioVersions && track.audioVersions.length > 0
  const fileCount = track.files?.length || 0
  const todoCount = track.todos?.filter(t => !t.done).length || 0
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

  // Fetch audio metadata for the first audio version
  useEffect(() => {
    if (hasAudio && track.audioVersions && track.audioVersions[0]?.path) {
      const audioPath = track.audioVersions[0].path
      // Extract extension from path
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
      }).catch(() => {
        // Ignore errors, keep placeholder values
      })
    }
  }, [hasAudio, track.audioVersions])

  const trackNumber = track.number || index

  return (
    <motion.div
      onClick={onOpen}
      onContextMenu={onContextMenu}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col rounded-xl",
        "bg-elevated/50 border border-subtle cursor-pointer",
        "hover:border-muted hover:bg-elevated trans-all",
        "group relative overflow-hidden"
      )}
      style={{ borderColor: `hsl(var(--color-border-default) / var(--project-color-muted))` }}
    >
      {/* Cover Art Area - album cover or placeholder */}
      <div className="relative aspect-square overflow-hidden bg-neutral-800/50">
        {coverSrc && (
          <>
            <img
              src={coverSrc}
              alt=""
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        )}
        {!coverSrc && (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `hsl(var(--project-color) / var(--project-color-subtle))` }}>
            <Music2 className="w-12 h-12 text-neutral-600 opacity-50" />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="p-md flex-1 flex flex-col min-h-0">
        {/* Title with number and status */}
        <div className="flex items-center gap-sm mb-xs">
          <span className="text-sm font-medium text-primary/80 flex-shrink-0 truncate">
            {trackNumber}. {track.title}
          </span>
          <StatusBadge status={track.status as keyof typeof TRACK_STATUSES} size="sm" />
        </div>
        
        <div className="flex items-center gap-sm text-body-sm text-muted mb-sm">
          {track.bpm && <span className="flex items-center gap-xs"><Music2 className="w-3 h-3" />{track.bpm} BPM</span>}
          {track.key && <span className="flex items-center gap-xs">🎹 {track.key}</span>}
        </div>

        <div className="flex items-center gap-md text-body-sm text-muted mt-auto pt-sm border-t border-subtle">
          <span className="flex items-center gap-xs"><Clock className="w-3 h-3" />{audioDuration}</span>
          <span className="flex items-center gap-xs"><FileText className="w-3 h-3" />{audioSize}</span>
          {audioExt && <span className="flex items-center gap-xs px-xs py-xs rounded bg-neutral-800 text-[10px] font-mono">{audioExt}</span>}
          {fileCount > 0 && <span className="flex items-center gap-xs"><FileText className="w-3 h-3" />{fileCount}</span>}
          {todoCount > 0 && <span className="flex items-center gap-xs text-amber-400">☑ {todoCount}</span>}
        </div>
      </div>

      {/* Actions - only visible on hover */}
      <div className="absolute top-sm right-sm flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0">
        {onAddToPlaylist && track.audioVersions?.length > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist() }}
            className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-emerald-600/20 flex items-center justify-center text-emerald-400 hover:text-emerald-300 trans-colors border border-white/10"
            title="Adicionar à Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        )}
        {onContextMenu && (
          <button
            onClick={(e) => { e.stopPropagation(); onContextMenu(e) }}
            className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 flex items-center justify-center text-neutral-400 hover:text-white trans-colors border border-white/10"
            title="Mais opções"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  )
}