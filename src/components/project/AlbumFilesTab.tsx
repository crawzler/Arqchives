'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, FileText, Image as ImageIcon, Video, Music2, Code, Trash2, Edit2, ExternalLink, Plus, ChevronDown } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useFileOperations } from '@/hooks/useElectron'
import { cn, formatFileSize, getFileIcon } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ContextMenu, useContextMenu, createFileContextMenuItems } from '@/components/ui/ContextMenu'
import { getFolderIconConfig, getFolderIconEmoji, getFolderColorVar } from '@/lib/folderIcons'
import type { FileDestinationOption } from './FileDestinationPicker'
import { FileImportPreviewModal } from './FileImportPreviewModal'
import type { SelectedImportFile } from './FileImportPreviewModal'
import { FilePreviewThumbnail } from './FilePreviewThumbnail'

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

export function AlbumFilesTab({ album, project, paths, viewMode = 'grid' }: AlbumFilesTabProps) {
  const { listFiles, openFile, deleteFile, renameFile, ensureFolder, moveOrCopyFile } = useFileOperations()
  const { removeAlbumFile, addAlbumFile, projectConfig } = useAppStore()
  const [folders, setFolders] = useState<Record<string, Array<{ name: string; path: string; ext: string; size: number; isDirectory: boolean }>>>({})
  const [loading, setLoading] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [expandedGridFolders, setExpandedGridFolders] = useState<Set<string>>(new Set())
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [pendingImportPaths, setPendingImportPaths] = useState<string[] | null>(null)

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

  const destinations = Object.entries(paths.albumSubfolders).map(([folderName, folderPath]) => ({
    id: `album:${folderName}`,
    label: folderName,
    path: folderPath,
    tagIds: projectConfig.folderTagConfig.albumFolders[folderName] || [],
  }))

  const copyFileToFolder = async (filePath: string, destination: FileDestinationOption) => {
    const folderResult = await ensureFolder(destination.path)
    if (!folderResult.ok) {
      window.alert(`Não foi possível preparar a pasta "${destination.label}": ${folderResult.error || 'erro desconhecido'}`)
      return
    }
    const result = await moveOrCopyFile({ srcPath: filePath, destFolder: destination.path, mode: 'copy' })
    if (!result.ok || !('newPath' in result) || !result.newPath) {
      window.alert(`Não foi possível copiar "${filePath.split(/[\\/]/).pop()}": ${result.error || 'erro desconhecido'}`)
      return
    }
    addAlbumFile(project.id, album.id, result.newPath)
  }

  const handleAddFiles = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Adicionar arquivos ao álbum',
      filters: [{ name: 'Todos os arquivos', extensions: ['*'] }],
      multiple: true,
    })
    if (result?.length) {
      setPendingImportPaths(result)
    }
  }

  const handleConfirmImport = async (files: Array<SelectedImportFile & { destination: FileDestinationOption }>) => {
    for (const file of files) {
      await copyFileToFolder(file.path, file.destination)
    }
    setPendingImportPaths(null)
    await loadAllFiles()
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
    if (result.ok && 'newPath' in result && result.newPath) {
      removeAlbumFile(project.id, album.id, filePath)
      addAlbumFile(project.id, album.id, result.newPath)
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

  const toggleGridFolder = (folderName: string) => {
    setExpandedGridFolders(prev => {
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
      <div className="space-y-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-body-sm font-medium text-secondary">Arquivos do Álbum</h3>
          <Button variant="outline" size="sm" onClick={handleAddFiles}>
            <Plus className="w-3.5 h-3.5 mr-xs" />
            <span>Adicionar</span>
          </Button>
        </div>

        {/* File count */}
        <p className="text-caption text-muted">{totalFiles} arquivo{totalFiles !== 1 ? 's' : ''} no total</p>

        {/* GRID VIEW - files grouped into visual galleries by folder */}
        {viewMode === 'grid' && (
          <AnimatePresence>
            <div className="space-y-xl">
              {Object.entries(paths.albumSubfolders).length === 0 ? (
                <div className="py-2xl text-center text-muted">Nenhuma pasta configurada no álbum</div>
              ) : Object.entries(paths.albumSubfolders).map(([folderName]) => {
                const files = groupedFiles[folderName] || []
                const folderConfig = getFolderIconConfig(folderName)
                const isExpanded = expandedGridFolders.has(folderName)

                return (
                  <motion.div
                    key={folderName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-sm"
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleGridFolder(folderName)}
                      className="flex w-full items-center gap-sm border-b border-subtle pb-sm text-left focus-ring"
                    >
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: getFolderColorVar(folderName) }}>
                        <span className="text-sm">{folderConfig.icon}</span>
                      </div>
                      <h4 className="min-w-0 truncate text-sm font-medium text-primary">{folderName}</h4>
                      <span className="text-caption text-muted">{files.length} arquivo{files.length !== 1 ? 's' : ''}</span>
                      <ChevronDown className={cn("ml-auto h-4 w-4 flex-shrink-0 text-muted transition-transform", isExpanded && "rotate-180")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {files.length === 0 ? (
                            <p className="py-sm text-sm text-muted">Pasta vazia</p>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 pt-sm sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
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
          <div>
              {Object.keys(paths.albumSubfolders).length === 0 ? (
                <div className="p-2xl text-center text-muted">Nenhuma pasta configurada no álbum</div>
              ) : (
                <AnimatePresence>
                  {Object.entries(paths.albumSubfolders).map(([folderName, _folderPath], folderIndex) => {
                    const files = groupedFiles[folderName] || []
                    const isExpanded = expandedFolders.has(folderName)
                    const folderConfig = getFolderIconConfig(folderName)
                    return (
                      <motion.div
                        key={folderName}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ transitionDelay: `${folderIndex * 0.03}s` }}
                        className="space-y-sm py-sm first:pt-0"
                      >
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          onClick={() => toggleFolder(folderName)}
                          className="flex w-full items-center gap-sm border-b border-subtle pb-sm text-left focus-ring"
                        >
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: getFolderColorVar(folderName) }}>
                            <span className="text-sm">{folderConfig.icon}</span>
                          </div>
                          <h4 className="min-w-0 truncate text-sm font-medium text-primary">{folderName}</h4>
                          <span className="text-caption text-muted">{files.length} arquivo{files.length !== 1 ? 's' : ''}</span>
                          <ChevronDown className={cn("ml-auto h-4 w-4 flex-shrink-0 text-muted transition-transform", isExpanded && "rotate-180")} />
                        </button>

                        {/* Files in this folder - Collapsible */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {files.length > 0 ? (
                                <div className="pt-xs">
                                  {files.map((file, fileIndex) => (
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
                                  ))}
                                </div>
                              ) : (
                                <div className="py-sm text-sm text-muted">
                                  Pasta vazia
                                  <Button variant="ghost" size="sm" className="ml-sm" onClick={(e) => { e.stopPropagation(); handleAddFiles() }}>
                                    <Plus className="w-3.5 h-3.5 mr-xs" /> Adicionar
                                  </Button>
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
      {pendingImportPaths && (
        <FileImportPreviewModal
          files={pendingImportPaths}
          destinations={destinations}
          tags={projectConfig.tags}
          onImport={handleConfirmImport}
          onClose={() => setPendingImportPaths(null)}
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
  const rowStyle = isListView
    ? "grid grid-cols-[40px_1fr_80px_40px] gap-sm px-md py-sm items-center hover:bg-hover trans-colors"
    : "min-w-0 overflow-hidden rounded-lg border border-subtle bg-elevated/40 trans-colors hover:border-white/15"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ transitionDelay: `${(index || 0) * 0.02}s` }}
      className={cn(rowStyle, "group")}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      {isListView ? (
        <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `hsl(var(--project-color) / var(--project-color-subtle))` }}>
          {getFileIcon(file.name)}
        </div>
      ) : (
        <div>
          <FilePreviewThumbnail path={file.path} name={file.name} />
          <div className="p-2.5">
            <div className="min-w-0">
              {isRenaming ? (
                <input
                  value={renameValue}
                  onChange={e => onRenameChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && onRename(file.path)}
                  onBlur={() => onRename(file.path)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded px-sm py-xs text-sm text-white focus-ring"
                  autoFocus
                />
              ) : (
                <p className="truncate text-xs font-medium text-primary" title={file.name}>{file.name}</p>
              )}
              <p className="mt-0.5 text-[11px] text-muted">{formatFileSize(file.size)}</p>
            </div>
            <div className="mt-2 flex items-center justify-end gap-1 opacity-100 trans-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <button onClick={(e) => { e.stopPropagation(); onOpen(file.path) }} className="flex h-7 w-7 items-center justify-center rounded bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white trans-colors focus-ring" title="Abrir">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onStartRename(file) }} className="flex h-7 w-7 items-center justify-center rounded bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white trans-colors focus-ring" title="Renomear">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(file.path, file.folder) }} className="flex h-7 w-7 items-center justify-center rounded bg-white/5 text-neutral-400 hover:bg-red-600/20 hover:text-red-400 trans-colors focus-ring" title="Deletar">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Name / Rename Input */}
      {isListView && <div className="flex-1 min-w-0">
        {isRenaming ? (
          <input
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onRename(file.path)}
            onBlur={() => onRename(file.path)}
            className="w-full bg-neutral-800 border border-neutral-600 rounded px-sm py-xs text-sm text-white focus-ring"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-primary truncate">{file.name}</p>
        )}
        {!isListView && <p className="text-caption text-muted">{formatFileSize(file.size)}</p>}
      </div>}

      {/* List view only: Size column */}
      {isListView && (
        <span className="text-right text-caption text-muted font-mono">{formatFileSize(file.size)}</span>
      )}

      {/* Actions */}
      {isListView && <div className="flex items-center gap-xs opacity-100">
        <button onClick={(e) => { e.stopPropagation(); onOpen(file.path) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white trans-colors focus-ring" title="Abrir">
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onStartRename(file) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white trans-colors focus-ring" title="Renomear">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(file.path, file.folder) }} className="w-7 h-7 rounded bg-white/5 hover:bg-red-600/20 flex items-center justify-center text-neutral-400 hover:text-red-400 trans-colors focus-ring" title="Deletar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>}
    </motion.div>
  )
}