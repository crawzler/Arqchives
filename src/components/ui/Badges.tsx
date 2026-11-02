'use client'

import { cn } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'

/**
 * StatusBadge - Componente unificado para status de tracks/álbuns
 * Substitui as 3 implementações diferentes em TrackRow, TrackCard, AlbumCard
 */
interface StatusBadgeProps {
  status: keyof typeof TRACK_STATUSES
  size?: 'sm' | 'md'
  showLabel?: boolean
  showDot?: boolean
}

// Map TrackStatus to token status colors
const STATUS_TOKEN_MAP: Record<keyof typeof TRACK_STATUSES, string> = {
  idea: 'idea',
  composing: 'planned',
  recording: 'in_progress',
  mixing: 'in_progress',
  mastering: 'planned',
  done: 'completed',
}

export function StatusBadge({ status, size = 'sm', showLabel = true, showDot = true }: StatusBadgeProps) {
  const info = TRACK_STATUSES[status]
  if (!info) return null

  const tokenStatus = STATUS_TOKEN_MAP[status]
  const label = showLabel ? info.label.split(' ')[1] || info.label : ''
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium uppercase tracking-wide',
        'bg-subtle backdrop-blur-sm border',
        padding,
        'rounded-full',
        textSize,
        `border-status-${tokenStatus}/40 text-status-${tokenStatus}`
      )}
      style={{ backgroundColor: `hsl(var(--color-status-${tokenStatus}) / 0.15)` }}
    >
      {showDot && <span className={cn('rounded-full', dotSize)} style={{ backgroundColor: `hsl(var(--color-status-${tokenStatus}))` }} />}
      {label && <span>{label}</span>}
    </span>
  )
}

/**
 * TypeBadge - Para tipos de álbum (Álbum, EP, Single, Compilação)
 */
interface TypeBadgeProps {
  type: 'Álbum' | 'EP' | 'Single' | 'Compilação' | string
  size?: 'sm' | 'md'
}

const TYPE_COLORS: Record<string, string> = {
  'Álbum': 'album',
  'EP': 'ep',
  'Single': 'single',
  'Compilação': 'compilation',
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || 'album'
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-2.5 py-1'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium uppercase tracking-wide whitespace-nowrap',
        'bg-subtle backdrop-blur-sm border',
        padding,
        'rounded-full',
        textSize,
        `border-type-${color}/40 text-type-${color}`
      )}
      style={{ backgroundColor: `hsl(var(--color-type-${color}) / 0.15)` }}
    >
      {type}
    </span>
  )
}

/**
 * FolderIcon - Ícone de pasta com cor semântica via token
 */
interface FolderIconProps {
  folderName: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const FOLDER_ICONS: Record<string, React.ReactNode> = {
  artwork: '🖼️',
  masters: '🎵',
  extras: '📦',
  audio: '🎵',
  stems: '🎚️',
  projects: '💻',
  lyrics: '📝',
  videos: '🎬',
  references: '🔗',
}

export function FolderIcon({ folderName, size = 'md', className }: FolderIconProps) {
  const icon = FOLDER_ICONS[folderName] || '📁'
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'

  return (
    <span
      className={cn('flex items-center justify-center', iconSize, className)}
      style={{ color: `hsl(var(--color-folder-${folderName}) || var(--color-folder-extras))` }}
    >
      {icon}
    </span>
  )
}