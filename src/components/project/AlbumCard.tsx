'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Music2, Clock, Edit2, Calendar } from 'lucide-react'
import { useFileOperations } from '@/hooks/useAlbumOperations'
import { usePathGenerator } from '@/hooks/useAlbumOperations'
import { cn } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { ContextMenu, useContextMenu, createAlbumContextMenuItems } from '@/components/ui/ContextMenu'
import { useAddAlbumToQueue, useActiveProject } from '@/store/useAppStore'
import { TypeBadge, StatusBadge } from '@/components/ui/Badges'

interface AlbumCardProps {
  album: import('@/types').Album
  project: import('@/types').Project
  projectColor: string
  onClick: () => void
  onEdit: (e: React.MouseEvent, album: import('@/types').Album) => void
  onContextMenu?: (e: React.MouseEvent) => void
}

export default function AlbumCard({ album, project, projectColor, onClick, onEdit, onContextMenu }: AlbumCardProps) {
  const { getLocalUrl } = useFileOperations()
  const { generateAlbumPaths } = usePathGenerator()
  const addAlbumToQueue = useAddAlbumToQueue()
  const activeProject = useActiveProject()
  const [coverSrc, setCoverSrc] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Context menu
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!activeProject) return

    const items = createAlbumContextMenuItems(
      album,
      () => onClick(), // Abrir álbum
      () => onEdit(e, album), // Editar álbum
      () => addAlbumToQueue(album, activeProject, { playImmediately: true }), // Adicionar à Playlist
      () => {
        // Copiar caminho do álbum
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        navigator.clipboard.writeText(paths.albumPath)
      },
      () => {
        // Deletar álbum
        if (window.confirm(`Deletar "${album.title}"?`)) {
          // TODO: Implement delete album action
        }
      },
      () => {
        // Abrir pasta do álbum
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        window.electronAPI?.openFile(paths.albumPath)
      }
    )

    openMenu(e, items)
  }

  useEffect(() => {
    if (album.coverPath) {
      if (album.coverPath.startsWith('data:')) {
        setCoverSrc(album.coverPath)
      } else {
        getLocalUrl(album.coverPath).then(setCoverSrc)
      }
    } else {
      setCoverSrc(null)
    }
  }, [album.coverPath, getLocalUrl])

  const getStatusCounts = () => {
    const counts: Record<string, number> = {}
    album.tracks.forEach(t => {
      counts[t.status] = (counts[t.status] || 0) + 1
    })
    return counts
  }

  const statusOrder = ['completed', 'in_progress', 'planned', 'missing', 'skipped'] as const

  return (
    <>
      <motion.button
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={onContextMenu || handleContextMenu}
        whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          "relative group bg-neutral-900 border rounded-xl overflow-hidden cursor-pointer",
          "hover:border-muted trans-all focus-ring"
        )}
        style={{ borderColor: `hsl(var(--color-border-default) / var(--project-color-strong))` }}
      >
        {/* Cover - clean, no overlays */}
        <div className="aspect-square relative overflow-hidden bg-neutral-950">
          {coverSrc ? (
            <motion.img
              src={coverSrc}
              alt={album.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `hsl(var(--project-color) / var(--project-color-subtle))` }}>
              <span className="text-6xl opacity-40">{album.type === 'Single' ? '🎵' : '💿'}</span>
            </div>
          )}
        </div>

        {/* Info panel - now contains everything */}
        <div className="p-lg border-t border-subtle bg-elevated/50">
          {/* Title */}
          <h3 className="font-semibold text-primary truncate mb-md tracking-tight text-heading-sm leading-snug">
            {album.title}
          </h3>

          {/* Bottom row: Type badge | Year | Status dots | Edit button */}
          <div className="flex items-center justify-between gap-md flex-wrap">
            {/* Left: Type + Year */}
            <div className="flex items-center gap-sm flex-1 min-w-0">
              {/* Type badge - using unified component */}
              <TypeBadge type={album.type} size="sm" />

              {/* Year */}
              <span className="px-sm py-xs rounded text-caption font-mono font-medium tabular-nums
                bg-neutral-900/50 backdrop-blur-sm border border-subtle text-muted whitespace-nowrap">
                <Calendar className="w-3 h-3 inline-block align-middle mr-xs" />
                {album.year}
              </span>
            </div>

            {/* Center: Status dots (only on hover to keep clean) */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: hovered ? 1 : 0, x: 0 }}
              transition={{ duration: 150 }}
              className="flex items-center gap-xs flex-shrink-0"
            >
              {statusOrder
                .filter(s => getStatusCounts()[s] > 0)
                .map((status) => {
                  const count = getStatusCounts()[status]
                  return (
                    <span
                      key={status}
                      className="px-xs py-xs rounded text-[9px] font-medium flex items-center gap-xs border
                        bg-neutral-900/50 backdrop-blur-sm text-white whitespace-nowrap"
                      style={{ borderColor: `hsl(var(--color-status-${status})) / 0.4` }}
                      title={`${TRACK_STATUSES[status as keyof typeof TRACK_STATUSES].label}: ${count}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(var(--color-status-${status}))` }} />
                      {count}
                    </span>
                  )
                })}
            </motion.div>

            {/* Right: Edit button */}
            <button
              onClick={(e) => onEdit(e, album)}
              className="w-8 h-8 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-sm
                flex items-center justify-center text-neutral-400 hover:text-white
                border border-subtle hover:border-muted trans-all
                opacity-0 group-hover:opacity-100 transition-opacity focus-ring"
              title="Editar álbum"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Track/Todo counts - subtle, bottom */}
          <div className="mt-md pt-md border-t border-subtle flex items-center justify-between text-body-sm">
            <div className="flex items-center gap-md text-muted font-mono tabular-nums">
              <span className="flex items-center gap-xs">
                <Music2 className="w-3 h-3 opacity-60" />
                {album.tracks.length}
              </span>
              {album.todos.length > 0 && (
                <span className="flex items-center gap-xs text-amber-400/80">
                  <Clock className="w-3 h-3" />
                  {album.todos.filter(t => !t.done).length}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.button>

      {menuItems && (
        <ContextMenu
          items={menuItems}
          x={menuX}
          y={menuY}
          onClose={closeMenu}
        />
      )}
    </>
  )
}