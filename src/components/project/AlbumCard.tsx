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
        // Deletar álbum - would need deleteAlbum from store
        // This would need to be passed as prop or accessed from store
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Álbum': return 'text-blue-400 border-blue-500/30'
      case 'EP': return 'text-green-400 border-green-500/30'
      case 'Single': return 'text-purple-400 border-purple-500/30'
      case 'Compilação': return 'text-amber-400 border-amber-500/30'
      default: return 'text-neutral-400 border-neutral-500/30'
    }
  }

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
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onContextMenu={onContextMenu || handleContextMenu}
        whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          "relative group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer",
          "hover:border-neutral-700 transition-all duration-200"
        )}
        style={{ borderColor: projectColor + '40' }}
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
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: projectColor + '15' }}>
              <span className="text-6xl opacity-40">{album.type === 'Single' ? '🎵' : '💿'}</span>
            </div>
          )}
        </div>

        {/* Info panel - now contains everything */}
        <div className="p-4 border-t border-neutral-800/50 bg-neutral-950/50">
          {/* Title */}
          <h3 className="font-semibold text-white truncate mb-3 tracking-tight text-base leading-snug">
            {album.title}
          </h3>

          {/* Bottom row: Type badge | Year | Status dots | Edit button */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Type + Year */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Type badge */}
              <span className={cn(
                "px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide whitespace-nowrap",
                "bg-black/60 backdrop-blur-sm border",
                getTypeColor(album.type)
              )}>
                {album.type}
              </span>

              {/* Year */}
              <span className="px-2 py-1 rounded text-[10px] font-mono font-medium tabular-nums
                bg-black/60 backdrop-blur-sm border border-neutral-700 text-neutral-400 whitespace-nowrap">
                <Calendar className="w-3 h-3 inline-block align-middle mr-1" />
                {album.year}
              </span>
            </div>

            {/* Center: Status dots (only on hover to keep clean) */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: hovered ? 1 : 0, x: 0 }}
              transition={{ duration: 150 }}
              className="flex items-center gap-1.5 flex-shrink-0"
            >
              {statusOrder
                .filter(s => getStatusCounts()[s] > 0)
                .map((status) => {
                  const count = getStatusCounts()[status]
                  const info = TRACK_STATUSES[status as keyof typeof TRACK_STATUSES]
                  return (
                    <span
                      key={status}
                      className="px-1.5 py-0.5 rounded text-[9px] font-medium flex items-center gap-1 border
                        bg-black/60 backdrop-blur-sm text-white whitespace-nowrap"
                      style={{ borderColor: info.color + '60' }}
                      title={`${info.label}: ${count}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
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
                border border-neutral-700 hover:border-neutral-600 transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20
                opacity-0 group-hover:opacity-100 transition-opacity"
              title="Editar álbum"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Track/Todo counts - subtle, bottom */}
          <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3 text-neutral-500 font-mono tabular-nums">
              <span className="flex items-center gap-1.5">
                <Music2 className="w-3 h-3 opacity-60" />
                {album.tracks.length}
              </span>
              {album.todos.length > 0 && (
                <span className="flex items-center gap-1.5 text-amber-400/80">
                  <Clock className="w-3 h-3" />
                  {album.todos.filter(t => !t.done).length}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

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