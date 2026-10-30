'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, FileText, Image as ImageIcon, Video, Music2, Code, Trash2, Edit2, ExternalLink, Plus, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useFileOperations } from '@/hooks/useElectron'
import { cn, formatFileSize, getFileIcon } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ContextMenu, useContextMenu, createFileContextMenuItems } from '@/components/ui/ContextMenu'

interface AlbumFilesTabProps {
  album: import('@/types').Album
  project: { id: string; name: string; color: string }
  paths: { albumPath: string; albumSubfolders: Record<string, string> }
  viewMode?: 'grid' | 'list'
}

interface FileItem {
  name: string
  path: string
  ext: string
  size: number
  folder: string
  folderPath: string
}

function getFolderIcon(name: string) {
  const icons: Record<string, React.ReactNode> = {
    artwork: <ImageIcon className="w-5 h-5 text-pink-400" />,
    masters: <Music2 className="w-5 h-5 text-emerald-400" />,
    extras: <FolderOpen className="w-5 h-5 text-amber-400" />,
    audio: <Music2 className="w-5 h-5 text-blue-400" />,
    stems: <Music2 className="w-5 h-5 text-purple-400" />,
    projects: <Code className="w-5 h-5 text-orange-400" />,
    lyrics: <FileText className="w-5 h-5 text-green-400" />,
    videos: <Video className="w-5 h-5 text-red-400" />,
    references: <ExternalLink className="w-5 h-5 text-cyan-400" />,
  }
  return icons[name] || <FolderOpen className="w-5 h-5 text-neutral-400" />
}

export function AlbumFilesTab({ album, project, paths, viewMode = 'grid' }: AlbumFilesTabProps) {
  const { listFiles, openFile, deleteFile, renameFile, ensureFolder, moveOrCopyFile } = useFileOperations()
  const { removeAlbumFile, addAlbumFile } = useAppStore()
  const [folders, setFolders] = useState<Record<string, Array<{ name: string; path: string; ext: string; size: number; isDirectory: boolean }>>>({})
  const [loading, setLoading] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  // Context menu
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()

  // Load all files
  const loadAllFiles = async () => {
    setLoading(true)
    const result: Record<string, any[]> = {}
    for (const [name, folderPath] of Object.entries(paths.albumSubfolders)) {
      const files = await listFiles(folderPath)
      result[name] = (files || []).filter(f => !f.isDirectory).sort((a, b) => a.name.localeCompare(b.name))
    }
    setFolders(result)
    setLoading(false)
  }

  useEffect(() => {
    loadAllFiles()
  }, [album.id])

  // Flatten all files for list view
  const allFiles = useMemo((): FileItem[] => {
    const items: FileItem[] = []
    for (const [folderName, folderPath] of Object.entries(paths.albumSubfolders)) {
      const files = folders[folderName] || []
      for (const file of files) {
        items.push({ ...file, folder: folderName, folderPath })
      }
    }
    return items
  }, [folders, paths.albumSubfolders])

  // Files grouped by folder for grid view
  const groupedFiles = useMemo(() => {
    const groups: Record<string, FileItem[]> = {}
    for (const file of allFiles) {
      if (!groups[file.folder]) groups[file.folder] = []
      groups[file.folder].push(file)
    }
    return groups
  }, [allFiles])

  const handleAddFiles = async (folderName: string) => {
    const folderPath = paths.albumSubfolders[folderName]
    if (!folderPath) return
    const result = await window.electronAPI?.selectFiles({
      title: `Adicionar arquivos à pasta ${folderName}`,
      filters: [{ name: 'Todos', extensions: ['*'] }],
      multiple: true,
    })
    if (result?.length) {
      await ensureFolder(folderPath)
      for (const filePath of result) {
        await moveOrCopyFile({ srcPath: filePath, destFolder: folderPath, mode: 'copy' })
        addAlbumFile(project.id, album.id, filePath)
      }
      loadAllFiles()
    }
  }

  const handleOpenFile = (filePath: string) => openFile(filePath)
  const handleDeleteFile = async (filePath: string, _folderName: string) => {
    if (!confirm('Deletar este arquivo permanentemente?')) return
    await deleteFile(filePath)
    removeAlbumFile(project.id, album.id, filePath)
    loadAllFiles()
  }
  const handleRenameFile = async (filePath: string) => {
    if (!renameValue.trim()) return
    const result = await renameFile(filePath, renameValue)
    if (result.ok) {
      removeAlbumFile(project.id, album.id, filePath)
      addAlbumFile(project.id, album.id, result.newPath!)
      loadAllFiles()
    }
    setRenaming(null)
  }
  const startRename = (file: { name: string; path: string }) => {
    setRenaming(file.path)
    setRenameValue(file.name)
  }

  const handleFileContextMenu = (e: React.MouseEvent, file: FileItem) => {
    const items = createFileContextMenuItems(
      file.path,
      file.name,
      () => openFile(file.path),
      () => navigator.clipboard.writeText(file.path),
      () => handleDeleteFile(file.path, file.folder),
      () => startRename(file),
      undefined
    )
    openMenu(e, items)
  }

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      next.has(folderName) ? next.delete(folderName) : next.add(folderName)
      return next
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" /></div>
  }

  const totalFiles = allFiles.length

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-300">Arquivos do Álbum</h3>
          <Button variant="outline" size="sm" onClick={() => handleAddFiles('artwork')}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Adicionar</span>
          </Button>
        </div>

        {/* File count */}
        <p className="text-xs text-neutral-500">{totalFiles} arquivo{totalFiles !== 1 ? 's' : ''} no total</p>

        {/* GRID VIEW - Folders as cards (each independent) */}
        {viewMode === 'grid' && (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(paths.albumSubfolders).map(([folderName, _folderPath]) => {
                const files = groupedFiles[folderName] || []
                const isExpanded = expandedFolders.has(folderName)

                return (
                  <motion.div
                    key={folderName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden"
                  >
                    {/* Folder Header */}
                    <button
                      onClick={() => toggleFolder(folderName)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-neutral-900 transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: project.color + '10' }}>
                        {getFolderIcon(folderName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">{folderName}</p>
                        <p className="text-xs text-neutral-500">{files.length} arquivo{files.length !== 1 ? 's' : ''}</p>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isExpanded && "rotate-180")} />
                    </button>

                    {/* Files List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-neutral-800 overflow-hidden bg-neutral-950/50"
                        >
                          {files.length === 0 ? (
                            <div className="p-4 text-center text-neutral-500 text-sm">
                              Pasta vazia
                              <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleAddFiles(folderName)}>
                                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                              </Button>
                            </div>
                          ) : (
                            <div className="divide-y divide-neutral-800 max-h-72 overflow-y-auto">
                              {files.map((file, index) => (
                                <FileRow
                                  key={file.path}
                                  file={file}
                                  projectColor={project.color}
                                  renaming={renaming}
                                  renameValue={renameValue}
                                  onRenameChange={setRenameValue}
                                  onStartRename={startRename}
                                  onRename={handleRenameFile}
                                  onOpen={handleOpenFile}
                                  onDelete={handleDeleteFile}
                                  onContextMenu={handleFileContextMenu}
                                  index={index}
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        )}

        {/* LIST VIEW - Collapsible folders with compact headers */}
        {viewMode === 'list' && (
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-neutral-800 max-h-[60vh] overflow-y-auto">
              {Object.keys(paths.albumSubfolders).length === 0 ? (
                <div className="p-8 text-center text-neutral-500">Nenhuma pasta configurada no álbum</div>
              ) : (
                <AnimatePresence>
                  {Object.entries(paths.albumSubfolders).map(([folderName, _folderPath], folderIndex) => {
                    const files = groupedFiles[folderName] || []
                    const isExpanded = expandedFolders.has(folderName)
                    return (
                      <motion.div
                        key={folderName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ transitionDelay: `${folderIndex * 0.03}s` }}
                      >
                        {/* Folder Header Row - Click to toggle */}
                        <button
                          onClick={() => toggleFolder(folderName)}
                          className="grid grid-cols-[40px_1fr_80px_40px] gap-2 px-3 py-1.5 items-center w-full text-left hover:bg-neutral-900/50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: project.color + '10' }}>
                            {getFolderIcon(folderName)}
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-400 transition-transform flex-shrink-0", isExpanded && "rotate-180")} />
                            <p className="text-sm font-medium text-neutral-300 truncate">{folderName}</p>
                          </div>
                          <span className="text-right text-xs text-neutral-500 font-mono">{files.length} arquivo{files.length !== 1 ? 's' : ''}</span>
                          <div className="flex items-center gap-1 opacity-50" />
                        </button>

                        {/* Files in this folder - Collapsible */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {files.length > 0 ? (
                                files.map((file, fileIndex) => (
                                  <FileRow
                                    key={file.path}
                                    file={file}
                                    projectColor={project.color}
                                    renaming={renaming}
                                    renameValue={renameValue}
                                    onRenameChange={setRenameValue}
                                    onStartRename={startRename}
                                    onRename={handleRenameFile}
                                    onOpen={handleOpenFile}
                                    onDelete={handleDeleteFile}
                                    onContextMenu={handleFileContextMenu}
                                    isListView
                                    index={fileIndex}
                                  />
                                ))
                              ) : (
                                <div className="grid grid-cols-[40px_1fr_80px_40px] gap-2 px-3 py-2 items-center text-center text-neutral-500 border-t border-neutral-800">
                                  <div className="col-span-4">
                                    Pasta vazia
                                    <Button variant="ghost" size="sm" className="ml-2" onClick={(e) => { e.stopPropagation(); handleAddFiles(folderName) }}>
                                      <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>

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

// ──────────────────────────────────────────────────────────────────────────────
// FileRow - Shared component for both grid and list views
// ──────────────────────────────────────────────────────────────────────────────
interface FileRowProps {
  file: FileItem
  projectColor: string
  renaming: string | null
  renameValue: string
  onRenameChange: (v: string) => void
  onStartRename: (file: { name: string; path: string }) => void
  onRename: (filePath: string) => void
  onOpen: (filePath: string) => void
  onDelete: (filePath: string, folderName: string) => void
  onContextMenu: (e: React.MouseEvent, file: FileItem) => void
  isListView?: boolean
  index?: number
}

function FileRow({ file, projectColor, renaming, renameValue, onRenameChange, onStartRename, onRename, onOpen, onDelete, onContextMenu, isListView, index }: FileRowProps) {
  const isRenaming = renaming === file.path
  const rowStyle = isListView ? "grid grid-cols-[40px_1fr_80px_40px] gap-2 px-3 py-1.5 items-center hover:bg-neutral-900/50 transition-colors" : "flex items-center gap-3 p-2 hover:bg-neutral-900/50 transition-colors"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ transitionDelay: `${(index || 0) * 0.02}s` }}
      className={cn(rowStyle, "group")}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      {/* File Icon */}
      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: projectColor + '10' }}>
        {getFileIcon(file.name)}
      </div>

      {/* File Name / Rename Input */}
      <div className="flex-1 min-w-0">
        {isRenaming ? (
          <input
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onRename(file.path)}
            onBlur={() => onRename(file.path)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-white truncate">{file.name}</p>
        )}
        {!isListView && <p className="text-xs text-neutral-500">{formatFileSize(file.size)}</p>}
      </div>

      {/* List view only: Size column */}
      {isListView && (
        <span className="text-right text-xs text-neutral-500 font-mono">{formatFileSize(file.size)}</span>
      )}

      {/* Actions */}
      <div className={cn("flex items-center gap-1", isListView ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity")}>
        <button onClick={(e) => { e.stopPropagation(); onOpen(file.path) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors" title="Abrir">
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onStartRename(file) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors" title="Renomear">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(file.path, file.folder) }} className="w-7 h-7 rounded bg-white/5 hover:bg-red-600/20 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-colors" title="Deletar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}