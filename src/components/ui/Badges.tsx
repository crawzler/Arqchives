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

export function StatusBadge({ status, size = 'sm', showLabel = true, showDot = true }: StatusBadgeProps) {
  const info = TRACK_STATUSES[status]
  if (!info) return null

  const label = showLabel ? info.label.split(' ')[1] || info.label : ''
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium uppercase tracking-wide',
        'bg-neutral-900/50 backdrop-blur-sm border',
        padding,
        'rounded-full',
        textSize,
        `border-${info.color}-500/40 text-${info.color}-400`
      )}
      style={{ backgroundColor: `hsl(var(--color-status-${status}) / 0.15)` }}
    >
      {showDot && <span className={cn('rounded-full', dotSize)} style={{ backgroundColor: `hsl(var(--color-status-${status}))` }} />}
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
  'Álbum': 'blue',
  'EP': 'emerald',
  'Single': 'violet',
  'Compilação': 'amber',
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const color = TYPE_COLORS[type] || 'neutral'
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-2.5 py-1'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium uppercase tracking-wide whitespace-nowrap',
        'bg-neutral-900/50 backdrop-blur-sm border',
        padding,
        'rounded-full',
        textSize,
        `border-${color}-500/40 text-${color}-400`
      )}
      style={{ backgroundColor: `hsl(var(--color-type-${type.toLowerCase().replace('ã', 'a').replace('ç', 'c')} || var(--color-type-album)) / 0.15)` }}
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

const FOLDER_COLORS: Record<string, string> = {
  artwork: 'pink',
  masters: 'emerald',
  extras: 'amber',
  audio: 'blue',
  stems: 'violet',
  projects: 'orange',
  lyrics: 'green',
  videos: 'red',
  references: 'cyan',
}

export function FolderIcon({ folderName, size = 'md', className }: FolderIconProps) {
  const icon = FOLDER_ICONS[folderName] || '📁'
  const color = FOLDER_COLORS[folderName] || 'neutral'
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