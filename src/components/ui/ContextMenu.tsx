'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image as ImageIcon, Video, Music2, Code, ExternalLink, Copy, Trash2, Edit2, Download, ListMusic, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  dividerAfter?: boolean
}

interface ContextMenuProps {
  items: ContextMenuItem[]
  x: number
  y: number
  onClose: () => void
}

export function ContextMenu({ items, x, y, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = () => onClose()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = x
    let top = y
    if (left + rect.width > vw) left = vw - rect.width - 8
    if (top + rect.height > vh) top = vh - rect.height - 8
    menuRef.current.style.left = `${left}px`
    menuRef.current.style.top = `${top}px`
  }, [x, y])

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -4 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 min-w-[150px] bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden"
        role="menu"
      >
        {items.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02, duration: 0.1 }}
            onClick={() => { item.onClick(); onClose() }}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-2 px-2.5 py-1.5 text-sm text-neutral-200 hover:bg-white/10 transition-colors",
              "focus:outline-none focus:bg-white/10",
              item.disabled && "opacity-50 cursor-not-allowed",
              item.danger && "text-red-400 hover:bg-red-600/10"
            )}
            role="menuitem"
            tabIndex={-1}
          >
            {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

interface UseContextMenuReturn {
  menuX: number
  menuY: number
  menuItems: ContextMenuItem[] | null
  openMenu: (e: React.MouseEvent, items: ContextMenuItem[]) => void
  closeMenu: () => void
}

export function useContextMenu(): UseContextMenuReturn {
  const [menuX, setMenuX] = useState(0)
  const [menuY, setMenuY] = useState(0)
  const [menuItems, setMenuItems] = useState<ContextMenuItem[] | null>(null)

  const openMenu = (e: React.MouseEvent, items: ContextMenuItem[]) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuX(e.clientX)
    setMenuY(e.clientY)
    setMenuItems(items)
  }

  const closeMenu = () => {
    setMenuItems(null)
  }

  return { menuX, menuY, menuItems, openMenu, closeMenu }
}

// Helper to create standard file/folder context menu items
export function createFileContextMenuItems(
  filePath: string,
  fileName: string,
  onOpen: () => void,
  onCopyPath: () => void,
  onDelete?: () => void,
  onRename?: () => void,
  onDownload?: () => void
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    { label: 'Abrir', icon: <ExternalLink className="w-4 h-4" />, onClick: onOpen },
    { label: 'Copiar caminho', icon: <Copy className="w-4 h-4" />, onClick: onCopyPath },
  ]
  
  if (onRename) items.push({ label: 'Renomear', icon: <Edit2 className="w-4 h-4" />, onClick: onRename })
  if (onDownload) items.push({ label: 'Baixar', icon: <Download className="w-4 h-4" />, onClick: onDownload })
  if (onDelete) items.push({ label: 'Deletar', icon: <Trash2 className="w-4 h-4" />, onClick: onDelete, danger: true })
  
  return items
}

export function createFolderContextMenuItems(
  folderPath: string,
  folderName: string,
  onOpen: () => void,
  onCopyPath: () => void,
  onDelete?: () => void,
  onRename?: () => void
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    { label: 'Abrir pasta', icon: <FolderOpen className="w-4 h-4" />, onClick: onOpen },
    { label: 'Copiar caminho', icon: <Copy className="w-4 h-4" />, onClick: onCopyPath },
  ]
  
  if (onRename) items.push({ label: 'Renomear', icon: <Edit2 className="w-4 h-4" />, onClick: onRename })
  if (onDelete) items.push({ label: 'Deletar pasta', icon: <Trash2 className="w-4 h-4" />, onClick: onDelete, danger: true })
  
  return items
}

export function createTrackContextMenuItems(
  track: { id: string; title: string },
  onOpen: () => void,
  onEdit: () => void,
  onCopyPath: () => void,
  onAddToPlaylist?: () => void,
  onDelete?: () => void
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    { label: 'Abrir', icon: <ExternalLink className="w-4 h-4" />, onClick: onOpen },
    { label: 'Editar', icon: <Edit2 className="w-4 h-4" />, onClick: onEdit },
    { label: 'Copiar caminho', icon: <Copy className="w-4 h-4" />, onClick: onCopyPath },
  ]
  
  if (onAddToPlaylist) items.push({ label: 'Adicionar à Playlist', icon: <ListMusic className="w-4 h-4" />, onClick: onAddToPlaylist })
  if (onDelete) items.push({ label: 'Deletar', icon: <Trash2 className="w-4 h-4" />, onClick: onDelete, danger: true })
  
  return items
}

export function createAlbumContextMenuItems(
  album: { id: string; title: string; type: string },
  onOpen: () => void,
  onEdit: () => void,
  onAddToPlaylist?: () => void,
  onCopyPath?: () => void,
  onDelete?: () => void,
  onOpenFolder?: () => void
): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    { label: 'Abrir álbum', icon: <ExternalLink className="w-4 h-4" />, onClick: onOpen },
  ]
  
  if (onOpenFolder) items.push({ label: 'Abrir pasta', icon: <FolderOpen className="w-4 h-4" />, onClick: onOpenFolder })
  if (onCopyPath) items.push({ label: 'Copiar caminho', icon: <Copy className="w-4 h-4" />, onClick: onCopyPath })
  if (onAddToPlaylist) items.push({ label: 'Adicionar à Playlist', icon: <ListMusic className="w-4 h-4" />, onClick: onAddToPlaylist })
  if (onEdit) items.push({ label: 'Editar álbum', icon: <Edit2 className="w-4 h-4" />, onClick: onEdit })
  if (onDelete) items.push({ label: 'Deletar álbum', icon: <Trash2 className="w-4 h-4" />, onClick: onDelete, danger: true })
  
  return items
}