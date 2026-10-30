import { cn } from '@/lib/utils'

/**
 * Folder icon mapping - single source of truth for folder icons and colors
 * Used by AlbumFilesTab, TrackFilesTab, and any future file browser
 */

export interface FolderIconConfig {
  icon: React.ReactNode
  colorToken: string  // CSS variable name like '--color-folder-artwork'
  fallbackColor: string  // Tailwind color class for fallback
}

// Folder icon configurations using design tokens
export const FOLDER_ICONS: Record<string, FolderIconConfig> = {
  artwork: {
    icon: '🖼️',
    colorToken: '--color-folder-artwork',
    fallbackColor: 'text-pink-400',
  },
  masters: {
    icon: '🎵',
    colorToken: '--color-folder-masters',
    fallbackColor: 'text-emerald-400',
  },
  extras: {
    icon: '📦',
    colorToken: '--color-folder-extras',
    fallbackColor: 'text-amber-400',
  },
  audio: {
    icon: '🎵',
    colorToken: '--color-folder-audio',
    fallbackColor: 'text-blue-400',
  },
  stems: {
    icon: '🎚️',
    colorToken: '--color-folder-stems',
    fallbackColor: 'text-purple-400',
  },
  projects: {
    icon: '💻',
    colorToken: '--color-folder-projects',
    fallbackColor: 'text-orange-400',
  },
  lyrics: {
    icon: '📝',
    colorToken: '--color-folder-lyrics',
    fallbackColor: 'text-green-400',
  },
  videos: {
    icon: '🎬',
    colorToken: '--color-folder-videos',
    fallbackColor: 'text-red-400',
  },
  references: {
    icon: '🔗',
    colorToken: '--color-folder-references',
    fallbackColor: 'text-cyan-400',
  },
}

// Default folder config
export const DEFAULT_FOLDER_CONFIG: FolderIconConfig = {
  icon: '📁',
  colorToken: '--color-folder-extras',
  fallbackColor: 'text-neutral-400',
}

/**
 * Get folder icon config by folder name
 */
export function getFolderIconConfig(folderName: string): FolderIconConfig {
  return FOLDER_ICONS[folderName] || DEFAULT_FOLDER_CONFIG
}

/**
 * Get folder icon as emoji string (for simple usage)
 */
export function getFolderIconEmoji(folderName: string): string {
  return getFolderIconConfig(folderName).icon
}

/**
 * Get folder color as CSS variable value (for inline styles)
 */
export function getFolderColorVar(folderName: string): string {
  const config = getFolderIconConfig(folderName)
  return `var(${config.colorToken})`
}

/**
 * Get folder color fallback class (for Tailwind className)
 */
export function getFolderColorClass(folderName: string): string {
  return getFolderIconConfig(folderName).fallbackColor
}