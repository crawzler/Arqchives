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
import { FileDestinationPicker, resolveFileDestination } from './FileDestinationPicker'
import type { FileDestinationOption } from './FileDestinationPicker'

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
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [pendingDestination, setPendingDestination] = useState<{
    filePath: string
    remainingPaths: string[]
    choices: FileDestinationOption[]
    reason: 'no-match' | 'multiple'
  } | null>(null)

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

  const importFiles = async (filePaths: string[]) => {
    for (let index = 0; index < filePaths.length; index += 1) {
      const filePath = filePaths[index]
      const decision = resolveFileDestination(filePath, destinations, projectConfig.tags)
      if ('destination' in decision) {
        await copyFileToFolder(filePath, decision.destination)
        continue
      }
      if (decision.choices.length === 0) {
        window.alert('Este álbum não possui pastas configuradas para receber arquivos.')
        continue
      }
      setPendingDestination({
        filePath,
        remainingPaths: filePaths.slice(index + 1),
        choices: decision.choices,
        reason: decision.reason,
      })
      return
    }
    await loadAllFiles()
  }

  const handleAddFiles = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Adicionar arquivos ao álbum',
      filters: [{ name: 'Todos os arquivos', extensions: ['*'] }],
      multiple: true,
    })
    if (result?.length) {
      await importFiles(result)
    }
  }

  const handleChooseDestination = async (destination: FileDestinationOption) => {
    if (!pendingDestination) return
    const { filePath, remainingPaths } = pendingDestination
    setPendingDestination(null)
    await copyFileToFolder(filePath, destination)
    await importFiles(remainingPaths)
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

        {/* GRID VIEW - Folders as cards (each independent) */}
        {viewMode === 'grid' && (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {Object.entries(paths.albumSubfolders).map(([folderName, _folderPath]) => {
                const files = groupedFiles[folderName] || []
                const isExpanded = expandedFolders.has(folderName)
                const folderConfig = getFolderIconConfig(folderName)

                return (
                  <motion.div
                    key={folderName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-elevated/50 border border-subtle rounded-xl overflow-hidden"
                  >
                    {/* Folder Header */}
                    <button
                      onClick={() => toggleFolder(folderName)}
                      className="w-full flex items-center gap-md p-md hover:bg-hover trans-colors text-left focus-ring"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: getFolderColorVar(folderName) }}>
                        <span className="text-lg">{folderConfig.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary truncate text-sm">{folderName}</p>
                        <p className="text-caption text-muted">{files.length} arquivo{files.length !== 1 ? 's' : ''}</p>
                      </div>
                      <ChevronDown className={cn("w-4 h-4 text-muted transition-transform", isExpanded && "rotate-180")} />
                    </button>

                    {/* Files List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-subtle overflow-hidden bg-elevated/30"
                        >
                          {files.length === 0 ? (
                            <div className="p-lg text-center text-muted text-sm">
                              Pasta vazia
                              <Button variant="ghost" size="sm" className="mt-sm" onClick={handleAddFiles}>
                                <Plus className="w-3.5 h-3.5 mr-xs" /> Adicionar
                              </Button>
                            </div>
                          ) : (
                            <div className="divide-y divide-subtle max-h-72 overflow-y-auto">
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
          <div className="bg-elevated/50 border border-subtle rounded-xl overflow-hidden">
            <div className="divide-y divide-subtle max-h-[60vh] overflow-y-auto">
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
                      >
                        {/* Folder Header Row - Click to toggle */}
                        <button
                          onClick={() => toggleFolder(folderName)}
                          className="grid grid-cols-[40px_1fr_80px_40px] gap-sm px-md py-sm items-center w-full text-left hover:bg-hover trans-colors focus-ring"
                        >
                          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: getFolderColorVar(folderName) }}>
                            <span className="text-base">{folderConfig.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0 flex items-center gap-sm">
                            <ChevronDown className={cn("w-3.5 h-3.5 text-muted transition-transform flex-shrink-0", isExpanded && "rotate-180")} />
                            <p className="text-sm font-medium text-secondary truncate">{folderName}</p>
                          </div>
                          <span className="text-right text-caption text-muted font-mono">{files.length} arquivo{files.length !== 1 ? 's' : ''}</span>
                          <div className="flex items-center gap-xs opacity-50" />
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
                                <div className="grid grid-cols-[40px_1fr_80px_40px] gap-sm px-md py-md items-center text-center text-muted border-t border-subtle">
                                  <div className="col-span-4">
                                    Pasta vazia
                                    <Button variant="ghost" size="sm" className="ml-sm" onClick={(e) => { e.stopPropagation(); handleAddFiles() }}>
                                      <Plus className="w-3.5 h-3.5 mr-xs" /> Adicionar
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
      <AnimatePresence>
        {pendingDestination && (
          <FileDestinationPicker
            fileName={pendingDestination.filePath.split(/[\\/]/).pop() || pendingDestination.filePath}
            choices={pendingDestination.choices}
            reason={pendingDestination.reason}
            onChoose={handleChooseDestination}
            onClose={() => setPendingDestination(null)}
          />
        )}
      </AnimatePresence>
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
  const rowStyle = isListView ? "grid grid-cols-[40px_1fr_80px_40px] gap-sm px-md py-sm items-center hover:bg-hover trans-colors" : "flex items-center gap-md p-sm hover:bg-hover trans-colors"

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{ transitionDelay: `${(index || 0) * 0.02}s` }}
      className={cn(rowStyle, "group")}
      onContextMenu={(e) => onContextMenu(e, file)}
    >
      {/* File Icon */}
      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `hsl(var(--project-color) / var(--project-color-subtle))` }}>
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
            className="w-full bg-neutral-800 border border-neutral-600 rounded px-sm py-xs text-sm text-white focus-ring"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-primary truncate">{file.name}</p>
        )}
        {!isListView && <p className="text-caption text-muted">{formatFileSize(file.size)}</p>}
      </div>

      {/* List view only: Size column */}
      {isListView && (
        <span className="text-right text-caption text-muted font-mono">{formatFileSize(file.size)}</span>
      )}

      {/* Actions */}
      <div className={cn("flex items-center gap-xs", isListView ? "opacity-100" : "opacity-0 group-hover:opacity-100 trans-opacity")}>
        <button onClick={(e) => { e.stopPropagation(); onOpen(file.path) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white trans-colors focus-ring" title="Abrir">
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onStartRename(file) }} className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white trans-colors focus-ring" title="Renomear">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(file.path, file.folder) }} className="w-7 h-7 rounded bg-white/5 hover:bg-red-600/20 flex items-center justify-center text-neutral-400 hover:text-red-400 trans-colors focus-ring" title="Deletar">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}