'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, RotateCw, Trash2, Plus, Folder, File, Music, Image, Video, Code, Search, Edit2, Sparkles } from 'lucide-react'
import { AppIcon } from '@/components/ui/AppIcon'
import { useAppStore, useProjects, useActiveProjectId, useShowTempFolder } from '@/store/useAppStore'
import { useFileOperations, useExternalDrop, usePathGenerator, useFileOrganizer } from '@/hooks/useAlbumOperations'
import { Button } from '@/components/ui/Button'
import { ContextMenu, useContextMenu, createFileContextMenuItems, createFolderContextMenuItems } from '@/components/ui/ContextMenu'
import { cn } from '@/lib/utils'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm']
const AUDIO_EXTS = ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma']

// ── Folder Tree Node ─────────────────────────────────────────────────────────────
interface FolderNode {
  name: string
  path: string
  children?: FolderNode[]
  isFile?: boolean
  ext?: string
  size?: number
}

function FolderTreeNode({ 
  node, 
  level = 0, 
  onClick, 
  onContextMenu,
  draggingNode,
  setDraggingNode,
  projectPaths,
  getFileIcon,
  selectedPath,
  expandedPaths,
  onToggleExpand
}: { 
  node: FolderNode
  level: number
  onClick: (e: React.MouseEvent, node: FolderNode) => void
  onContextMenu?: (e: React.MouseEvent, node: FolderNode) => void
  draggingNode: FolderNode | null
  setDraggingNode: (node: FolderNode | null) => void
  projectPaths: { projectPath: string; subfolders: Record<string, string> } | null
  getFileIcon: (ext: string) => React.ReactNode
  selectedPath: string | null
  expandedPaths: Set<string>
  onToggleExpand: (path: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const expanded = expandedPaths.has(node.path)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasChildren) {
      onToggleExpand(node.path)
      // Also navigate when clicking folder (even if it has children)
      onClick(e, node)
    } else {
      onClick(e, node)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    setDraggingNode(node)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggingNode(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggingNode && !draggingNode.isFile && hasChildren) {
      // Lógica de drop interno pode ser adicionada depois
    }
    setDraggingNode(null)
  }

  const isActiveTarget = draggingNode && draggingNode.path !== node.path && hasChildren

  const indent = level * 16

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-1 px-1 py-1 rounded transition-colors cursor-pointer",
          "hover:bg-white/5",
          isActiveTarget && "bg-emerald-500/10 border-l-2 border-emerald-500",
          draggingNode?.path === node.path && "opacity-50",
          "select-none",
          selectedPath === node.path && "bg-emerald-500/20 border-l-2 border-emerald-500"
        )}
        style={{ paddingLeft: 8 + indent }}
        onClick={handleClick}
        onContextMenu={(e) => onContextMenu?.(e, node)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        draggable={!node.isFile}
      >
        {hasChildren ? (
          <motion.button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(node.path) }}
            className="w-5 h-5 flex items-center justify-center text-neutral-500 hover:text-white hover:bg-white/5 rounded transition-colors"
            aria-label={expanded ? 'Colapsar' : 'Expandir'}
          >
            <ChevronRight className="w-3.5 h-3.5" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </motion.button>
        ) : (
          <span className="w-5" />
        )}
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {node.isFile ? (
            <>
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {getFileIcon(node.ext || '')}
              </div>
              <span className="text-xs text-neutral-300 truncate" title={node.name}>{node.name}</span>
              {node.size !== undefined && (
                <span className="text-[10px] text-neutral-500 flex-shrink-0 ml-auto">{(node.size / 1024).toFixed(1)} KB</span>
              )}
            </>
          ) : (
            <>
              <Folder className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
              <span className="text-xs font-medium text-neutral-200 truncate" title={node.name}>{node.name}</span>
            </>
          )}
        </div>

        {!node.isFile && hasChildren && (
          <span className="text-[10px] text-neutral-600 px-1.5 py-0.5 rounded bg-neutral-800">
            {node.children!.length}
          </span>
        )}
      </div>

      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map((child) => (
              <FolderTreeNode
                key={child.path}
                node={child}
                level={level + 1}
                onClick={onClick}
                onContextMenu={onContextMenu}
                draggingNode={draggingNode}
                setDraggingNode={setDraggingNode}
                projectPaths={projectPaths}
                getFileIcon={getFileIcon}
                selectedPath={selectedPath}
                expandedPaths={expandedPaths}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Folder Tree ──────────────────────────────────────────────────────────────────
function FolderTree({ 
  projectPaths, 
  onFileClick, 
  onFolderClick 
}: { 
  projectPaths: { projectPath: string; subfolders: Record<string, string> } | null
  onFileClick: (path: string) => void
  onFolderClick: (path: string) => void
}) {
  const [tree, setTree] = useState<FolderNode | null>(null)
  const [loading, setLoading] = useState(false)
  const [draggingNode, setDraggingNode] = useState<FolderNode | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const { listFiles } = useFileOperations()
  const treeRef = useRef<FolderNode | null>(null)

  // Keep ref in sync with tree state
  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  // Listen for album selection from main panel to sync sidebar
  useEffect(() => {
    const handleAlbumSelected = (e: any) => {
      const { path } = e.detail
      setSelectedPath(path)
      // Expand all parent paths to show the selected folder
      const pathsToExpand = getParentPaths(treeRef.current, path)
      setExpandedPaths(prev => new Set([...prev, ...pathsToExpand]))
    }
    window.addEventListener('arqchives:album-selected', handleAlbumSelected)
    return () => window.removeEventListener('arqchives:album-selected', handleAlbumSelected)
  }, [])

  // Listen for track selection from main panel to sync sidebar
  useEffect(() => {
    const handleTrackSelected = (e: any) => {
      const { path, albumPath } = e.detail
      setSelectedPath(path)
      // Expand all parent paths including album path
      const pathsToExpand = getParentPaths(treeRef.current, path)
      setExpandedPaths(prev => new Set([...prev, ...pathsToExpand]))
    }
    window.addEventListener('arqchives:track-selected', handleTrackSelected)
    return () => window.removeEventListener('arqchives:track-selected', handleTrackSelected)
  }, [])

  // Also listen for navigate events (from sidebar clicks) to update local state immediately
  useEffect(() => {
    const handleNavigate = (e: any) => {
      const { path } = e.detail
      setSelectedPath(path)
      const pathsToExpand = getParentPaths(treeRef.current, path)
      setExpandedPaths(prev => new Set([...prev, ...pathsToExpand]))
    }
    window.addEventListener('arqchives:navigate', handleNavigate)
    return () => window.removeEventListener('arqchives:navigate', handleNavigate)
  }, [])

  // Helper to get all parent paths of a target path in the tree
  const getParentPaths = (node: FolderNode | null, targetPath: string): string[] => {
    if (!node) return []
    
    const normalize = (p: string) => p.replace(/\\$/, '').toLowerCase()
    const targetNorm = normalize(targetPath)
    const nodeNorm = normalize(node.path)
    
    if (nodeNorm === targetNorm) {
      return [node.path]
    }
    
    if (node.children) {
      for (const child of node.children) {
        const childPaths = getParentPaths(child, targetPath)
        if (childPaths.length > 0) {
          return [node.path, ...childPaths]
        }
      }
    }
    
    return []
  }

  const getFileIcon = (ext: string) => {
    if (AUDIO_EXTS.includes(ext)) return <Music className="w-4 h-4 text-emerald-400" />
    if (IMAGE_EXTS.includes(ext)) return <Image className="w-4 h-4 text-blue-400" />
    if (VIDEO_EXTS.includes(ext)) return <Video className="w-4 h-4 text-purple-400" />
    if (['.zip', '.rar', '.7z'].includes(ext)) return <File className="w-4 h-4 text-amber-400" />
    if (['.rpp', '.als', '.flp', '.logic', '.ptx'].includes(ext)) return <Code className="w-4 h-4 text-orange-400" />
    return <File className="w-4 h-4 text-neutral-400" />
  }

  const buildTree = async (dirPath: string, name: string): Promise<FolderNode> => {
    const result = await listFiles(dirPath)
    const children: FolderNode[] = []
    
    if (result) {
      for (const item of result) {
        if (item.isDirectory) {
          const childNode = await buildTree(item.path, item.name)
          children.push(childNode)
        } else {
          children.push({
            name: item.name,
            path: item.path,
            isFile: true,
            ext: item.ext,
            size: item.size
          })
        }
      }
    }
    
    return { name, path: dirPath, children }
  }

  const loadTree = async () => {
    if (!projectPaths?.projectPath) return
    setLoading(true)
    try {
      const rootNode = await buildTree(projectPaths.projectPath, 'Projeto')
      setTree(rootNode)
    } catch (e) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTree()
  }, [projectPaths?.projectPath])

  const handleNodeClick = (_e: React.MouseEvent, node: FolderNode) => {
    if (node.isFile) {
      onFileClick(node.path)
    } else {
      onFolderClick(node.path)
      // Disparar evento para o painel principal
      window.dispatchEvent(new CustomEvent('arqchives:navigate', { detail: { path: node.path } }))
    }
  }

  // Context menu
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()

  const handleContextMenu = (e: React.MouseEvent, node: FolderNode) => {
    e.preventDefault()
    e.stopPropagation()
    const items = node.isFile
      ? createFileContextMenuItems(
          node.path,
          node.name,
          () => onFileClick(node.path), // Abrir
          () => navigator.clipboard.writeText(node.path), // Copiar caminho
          undefined, // Deletar - não implementado aqui
          undefined, // Renomear - não implementado aqui
          undefined  // Baixar - não implementado aqui
        )
      : createFolderContextMenuItems(
          node.path,
          node.name,
          () => onFolderClick(node.path), // Abrir pasta
          () => navigator.clipboard.writeText(node.path), // Copiar caminho
          undefined, // Deletar - não implementado aqui
          undefined  // Renomear - não implementado aqui
        )
    openMenu(e, items)
  }

  if (!projectPaths?.projectPath) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
        Nenhum projeto selecionado
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-1">
      {loading ? (
        <div className="flex items-center justify-center h-32 text-neutral-500 text-xs">
          Carregando estrutura...
        </div>
      ) : tree ? (
        <>
          <FolderTreeNode
            node={tree}
            level={0}
            onClick={handleNodeClick}
            onContextMenu={handleContextMenu}
            draggingNode={draggingNode}
            setDraggingNode={setDraggingNode}
            projectPaths={projectPaths}
            getFileIcon={getFileIcon}
            selectedPath={selectedPath}
            expandedPaths={expandedPaths}
            onToggleExpand={(path) => setExpandedPaths(prev => {
              const next = new Set(prev)
              if (next.has(path)) next.delete(path)
              else next.add(path)
              return next
            })}
          />
          {menuItems && (
            <ContextMenu
              items={menuItems}
              x={menuX}
              y={menuY}
              onClose={closeMenu}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-32 text-neutral-500 text-xs">
          Pasta do projeto não encontrada
        </div>
      )}
    </div>
  )
}

// ── Project Selector Dropdown ────────────────────────────────────────────────────
function ProjectSelector({ 
  projects, 
  activeProjectId, 
  onSelect, 
  onDeleteProject,
  onUpdateProject,
  organizeProjectFile,
  getLocalUrl
}: { 
  projects: any[]
  activeProjectId: string | null
  onSelect: (id: string) => void
  onDeleteProject: (id: string) => void
  onUpdateProject: (id: string, data: Partial<{ name: string; genre: string; photo: string }>) => void
  organizeProjectFile: (filePath: string, projectName: string) => Promise<string>
  getLocalUrl: (filePath: string) => Promise<string | null>
}) {
  const [open, setOpen] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', genre: '', photo: '', photoFilePath: '' })
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for focus event from main area
  useEffect(() => {
    const handleFocus = () => {
      setOpen(true)
    }
    window.addEventListener('arqchives:focus-projects', handleFocus)
    return () => window.removeEventListener('arqchives:focus-projects', handleFocus)
  }, [])

  const activeProject = projects.find(p => p.id === activeProjectId)
  const [activeProjectPhotoUrl, setActiveProjectPhotoUrl] = useState<string | null>(null)
  const [projectPhotoUrls, setProjectPhotoUrls] = useState<Record<string, string>>({})

  // Convert project photo paths to file:// URLs for display
  useEffect(() => {
    if (activeProject?.photo && !activeProject.photo.startsWith('data:')) {
      getLocalUrl(activeProject.photo).then(setActiveProjectPhotoUrl)
    } else if (activeProject?.photo?.startsWith('data:')) {
      setActiveProjectPhotoUrl(activeProject.photo)
    } else {
      setActiveProjectPhotoUrl(null)
    }
  }, [activeProject?.photo, getLocalUrl])

  // Convert all project photos
  useEffect(() => {
    let mounted = true
    const loadUrls = async () => {
      const urls: Record<string, string> = {}
      const promises = projects.map(async (p) => {
        if (p.photo && !p.photo.startsWith('data:')) {
          const url = await getLocalUrl(p.photo)
          if (url) urls[p.id] = url
        } else if (p.photo?.startsWith('data:')) {
          urls[p.id] = p.photo
        }
      })
      await Promise.all(promises)
      if (mounted) setProjectPhotoUrls(urls)
    }
    loadUrls()
    return () => { mounted = false }
  }, [projects, getLocalUrl])

  // Handler functions for edit/delete
  const startEditing = (project: any) => {
    setEditingProjectId(project.id)
    setEditForm({ name: project.name, genre: project.genre || '', photo: project.photo || '', photoFilePath: '' })
    // Use converted URL for preview if available, otherwise use original (data URL)
    setEditPhotoPreview(projectPhotoUrls[project.id] || project.photo || null)
  }

  const handleEditSubmit = async (projectId: string) => {
    // If there's a new photo file, organize it first
    if (editForm.photoFilePath) {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        const organizedPath = await organizeProjectFile(editForm.photoFilePath, project.name)
        onUpdateProject(projectId, { ...editForm, photo: organizedPath })
      } else {
        onUpdateProject(projectId, editForm)
      }
    } else {
      onUpdateProject(projectId, editForm)
    }
    setEditingProjectId(null)
    setEditForm({ name: '', genre: '', photo: '', photoFilePath: '' })
    setEditPhotoPreview(null)
  }

  const handleEditPhotoSelect = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Selecionar foto do projeto',
      filters: [{ name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
      multiple: false,
    })
    if (!result?.[0]) return
    const filePath = result[0]
    // Create preview from file path
    const previewUrl = await getLocalUrl(filePath)
    if (previewUrl) {
      setEditPhotoPreview(previewUrl)
      setEditForm({ ...editForm, photo: previewUrl, photoFilePath: filePath })
    }
  }

  const handleDelete = (projectId: string, projectName: string) => {
    if (confirm(`Deletar o projeto "${projectName}"? Esta ação não pode ser desfeita.`)) {
      onDeleteProject(projectId)
      setOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className="relative p-2 border-b border-neutral-800 bg-neutral-950">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-2 rounded-lg transition-colors",
          "hover:bg-neutral-800 text-left"
        )}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-neutral-800">
          {activeProjectPhotoUrl ? (
            <img src={activeProjectPhotoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <AppIcon size={16} className="opacity-60" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{activeProject?.name || 'Selecione...'}</p>
          {activeProject?.genre && <p className="text-[10px] text-neutral-500 truncate">{activeProject.genre}</p>}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-neutral-500 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-2 right-2 mt-1 bg-neutral-950 border border-neutral-800 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto"
          >
            {projects.length === 0 ? (
              // Empty state for no projects
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 space-y-4"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--primary))/20 0%, hsl(var(--accent))/10 100%)', border: '1px solid hsl(var(--primary))/30' }}
                  >
                    <Sparkles className="w-7 h-7 text-white" style={{ color: 'hsl(var(--primary))' }} />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="font-semibold text-white text-sm">Nenhum projeto ainda</h3>
                    <p className="text-[11px] text-neutral-500 mt-1">Crie seu primeiro projeto para começar a organizar</p>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="w-full gap-2" 
                  style={{ '--accent': 'hsl(var(--primary))' }}
                  onClick={() => {
                    setOpen(false)
                    window.dispatchEvent(new CustomEvent('arqchives:new-project'))
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Criar Primeiro Projeto</span>
                </Button>
                <p className="text-center text-[10px] text-neutral-500">
                  Projetos guardam álbuns, faixas, arquivos e configurações
                </p>
              </motion.div>
            ) : (
              <>
                          {projects.map((project) => {
                  const isEditing = editingProjectId === project.id
                  
                  if (isEditing) {
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="p-2 space-y-2 border-b border-neutral-800"
                      >
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Nome do projeto"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                          autoFocus
                        />
                        <input
                          value={editForm.genre}
                          onChange={e => setEditForm({ ...editForm, genre: e.target.value })}
                          placeholder="Gênero (opcional)"
                          className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-400">Foto do projeto</label>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={handleEditPhotoSelect}
                                className={cn(
                                  "w-16 h-16 rounded-xl border-2 border-dashed border-neutral-700 flex items-center justify-center overflow-hidden transition-colors",
                                  editPhotoPreview ? "border-emerald-500" : "hover:border-white/30"
                                )}
                              >
                                {editPhotoPreview ? (
                                  <img src={editPhotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center gap-1 text-neutral-500">
                                    <Image className="w-5 h-5" />
                                    <span className="text-[10px]">Adicionar</span>
                                  </div>
                                )}
                              </button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-neutral-400">Clique para selecionar uma imagem</p>
                              <p className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WebP • Máx. 2MB</p>
                              {editPhotoPreview && (
                                <Button variant="ghost" size="sm" className="mt-2 text-red-400 hover:text-red-300" onClick={() => { setEditPhotoPreview(null); setEditForm({ ...editForm, photo: '' }); }}>
                                  Remover foto
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setEditingProjectId(null); setEditForm({ name: '', genre: '', photo: '', photoFilePath: '' }); setEditPhotoPreview(null); }}>
                            Cancelar
                          </Button>
                          <Button size="sm" className="flex-1" onClick={() => handleEditSubmit(project.id)} disabled={!editForm.name.trim()}>
                            Salvar
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20" 
                            onClick={() => { handleDelete(project.id, project.name); setEditingProjectId(null); setEditForm({ name: '', genre: '', photo: '', photoFilePath: '' }); setEditPhotoPreview(null); }}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </motion.div>
                    )
                  }
                  
                  return (
                    <div key={project.id} className="relative group">
                      <button
                        onClick={() => { onSelect(project.id); setOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-2 rounded transition-colors text-left",
                          activeProjectId === project.id ? "bg-white/5" : "hover:bg-neutral-800"
                        )}
                      >
                        <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 overflow-hidden bg-neutral-800">
                          {projectPhotoUrls[project.id] ? (
                            <img src={projectPhotoUrls[project.id]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <AppIcon size={14} className="opacity-60" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">{project.name}</p>
                          {project.genre && <p className="text-[10px] text-neutral-500 truncate">{project.genre}</p>}
                        </div>
                        {activeProjectId === project.id && (
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-white" />
                        )}
                        {/* Edit button - visible on hover */}
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditing(project); }}
                          className="w-7 h-7 rounded flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </button>
                    </div>
                  )
                })}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Temp Folder (compacto) ──────────────────────────────────────────────────────
function TempFolder({ appRoot }: { appRoot: string | null }) {
  const [files, setFiles] = useState<Array<{ name: string; path: string; ext: string; size: number }>>([])
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [dropping, setDropping] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { listFiles, ensureFolder, moveOrCopyFile, openFile, revealFile, deleteFile, dragOutFile, getLocalUrl } = useFileOperations()

  const tempPath = appRoot ? `${appRoot}\\__temp` : null

  const loadFiles = async () => {
    if (!tempPath) return
    const result = await listFiles(tempPath)
    const fileList = (result || []).filter(f => !f.isDirectory)
    setFiles(fileList)
    
    // Convert file paths to URLs
    const urls: Record<string, string> = {}
    for (const f of fileList) {
      if (IMAGE_EXTS.includes(f.ext)) {
        const url = await getLocalUrl(f.path)
        if (url) urls[f.path] = url
      }
    }
    setFileUrls(urls)
  }

  useEffect(() => { if (tempPath) loadFiles() }, [tempPath])
  useEffect(() => { if (tempPath) ensureFolder(tempPath) }, [tempPath])

  const handleFileClick = (filePath: string) => openFile(filePath)
  const handleDelete = async (filePath: string, name: string) => {
    if (!confirm(`Deletar "${name}"?`)) return
    await deleteFile(filePath)
    loadFiles()
  }

  // Context menu
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()

  const handleFileContextMenu = (e: React.MouseEvent, file: { name: string; path: string; ext: string; size: number }) => {
    const items = createFileContextMenuItems(
      file.path,
      file.name,
      () => revealFile(file.path),
      () => openFile(file.path),
      () => navigator.clipboard.writeText(file.path),
      () => handleDelete(file.path, file.name),
      undefined,
      undefined
    )
    openMenu(e, items)
  }

  const [draggingFile, setDraggingFile] = useState<{ path: string; sourceFolder: string } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onDragEnter(e: DragEvent) { e.preventDefault(); e.stopPropagation(); if (!el.contains(e.relatedTarget as Node)) { setDropping(true) } }
    function onDragLeave(e: DragEvent) { e.preventDefault(); e.stopPropagation(); if (!el.contains(e.relatedTarget as Node)) { setDropping(false) } }
    function onDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = draggingFile ? 'move' : 'copy'; setDropping(true) }
    async function onDrop(e: DragEvent) {
      e.preventDefault(); e.stopPropagation(); setDropping(false)
      const internal = draggingFile
      if (internal && tempPath) {
        setDraggingFile(null)
        await moveOrCopyFile({ srcPath: internal.path, destFolder: tempPath, mode: 'move' })
        loadFiles(); return
      }
      const paths = e.dataTransfer.files
      if (paths.length && tempPath) {
        await ensureFolder(tempPath)
        await Promise.all(Array.from(paths).map(p => moveOrCopyFile({ srcPath: p.path, destFolder: tempPath, mode: 'copy' })))
        loadFiles()
      }
    }

    el.addEventListener('dragenter', onDragEnter)
    el.addEventListener('dragleave', onDragLeave)
    el.addEventListener('dragover', onDragOver)
    el.addEventListener('drop', onDrop)
    return () => { el.removeEventListener('dragenter', onDragEnter); el.removeEventListener('dragleave', onDragLeave); el.removeEventListener('dragover', onDragOver); el.removeEventListener('drop', onDrop) }
  }, [tempPath, draggingFile, listFiles, ensureFolder, moveOrCopyFile])

  useExternalDrop(async (paths) => {
    if (!tempPath) return
    await ensureFolder(tempPath)
    await Promise.all(paths.map(p => moveOrCopyFile({ srcPath: p, destFolder: tempPath, mode: 'copy' })))
    loadFiles()
  })

  if (!tempPath) return null

  const getFileIcon = (ext: string) => {
    if (AUDIO_EXTS.includes(ext)) return <Music className="w-6 h-6 text-emerald-400" />
    if (IMAGE_EXTS.includes(ext)) return <Image className="w-6 h-6 text-blue-400" />
    if (VIDEO_EXTS.includes(ext)) return <Video className="w-6 h-6 text-purple-400" />
    if (['.zip', '.rar', '.7z'].includes(ext)) return <File className="w-6 h-6 text-amber-400" />
    if (['.rpp', '.als', '.flp'].includes(ext)) return <Code className="w-6 h-6 text-orange-400" />
    return <File className="w-6 h-6 text-neutral-400" />
  }

  return (
    <>
      <motion.div
        ref={ref}
        className={cn("border-t border-neutral-800 p-2", dropping && "bg-white/5")}
        animate={{ opacity: dropping ? 1 : 0.7 }}
      >
      <div className="flex items-center justify-between px-1 py-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-neutral-800 flex items-center justify-center">
            <RotateCw className="w-3 h-3 text-amber-400" />
          </div>
          <span className="text-xs font-medium text-neutral-300">Temp</span>
        </div>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="w-6 h-6 p-0" onClick={loadFiles} title="Atualizar"><RotateCw className="w-3 h-3" /></Button>
        </div>
      </div>

      <div className="px-1 pb-1">
        {files.length === 0 ? (
          <div className={cn("h-24 rounded-lg flex flex-col items-center justify-center gap-1.5 text-neutral-500 border border-dashed border-neutral-700", dropping && "bg-white/5 border-amber-400")}>
            <RotateCw className="w-6 h-6" />
            <span className="text-xs">{dropping ? 'Soltar aqui' : 'Arraste arquivos aqui'}</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {files.map((f) => (
              <motion.div
                key={f.path}
                className="group relative rounded-lg bg-neutral-900/50 border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => handleFileClick(f.path)}
                onContextMenu={(e) => handleFileContextMenu(e, f)}
                draggable
                onDragStart={() => setDraggingFile({ path: f.path, sourceFolder: tempPath! })}
                onDragEnd={() => setDraggingFile(null)}
              >
                <div className="aspect-square relative flex items-center justify-center p-1">
                  {IMAGE_EXTS.includes(f.ext) && fileUrls[f.path] && <img src={fileUrls[f.path]} alt={f.name} className="w-full h-full object-cover rounded" loading="lazy" />}
                  {!IMAGE_EXTS.includes(f.ext) && <div className="flex items-center justify-center w-full h-full">{getFileIcon(f.ext)}</div>}
                </div>
                <div className="p-1.5">
                  <p className="text-xs font-medium text-white truncate">{f.name}</p>
                  <p className="text-[9px] text-neutral-500 mt-0.5">{(f.size / 1024).toFixed(1)} KB</p>
                </div>
                <div className="absolute top-0.5 right-0.5 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); dragOutFile(f.path) }} className="w-5 h-5 rounded bg-black/50 hover:bg-black/70 text-neutral-300 flex items-center justify-center" title="Arrastar para fora"><Search className="w-2.5 h-2.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(f.path, f.name) }} className="w-5 h-5 rounded bg-black/50 hover:bg-red-600/30 text-neutral-300 hover:text-red-400 flex items-center justify-center" title="Deletar"><Trash2 className="w-2.5 h-2.5" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

// ── Sidebar Principal ────────────────────────────────────────────────────────────
export default function Sidebar() {
  const projects = useProjects()
  const activeProjectId = useActiveProjectId()
  const { setActiveProject, deleteProject, updateProject } = useAppStore()
  const { appRoot } = useAppStore()
  const { generateProjectPaths } = usePathGenerator()
  const { organizeProjectFile } = useFileOrganizer()
  const { getLocalUrl } = useFileOperations()
  const showTempFolder = useShowTempFolder()

  // Usar o generateProjectPaths do hook
  const activeProject = projects.find(p => p.id === activeProjectId)
  const projectPaths = activeProject && appRoot ? generateProjectPaths(activeProject.name) : null

  return (
    <>
      <aside className="w-full h-full bg-neutral-950 border-r border-neutral-800 flex flex-col overflow-hidden">
        {/* Project Selector */}
        <ProjectSelector
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={setActiveProject}
          onDeleteProject={deleteProject}
          onUpdateProject={updateProject}
          organizeProjectFile={organizeProjectFile}
          getLocalUrl={getLocalUrl}
        />

        {/* Folder Tree */}
        <FolderTree
          projectPaths={projectPaths}
          onFileClick={(path) => {}}
          onFolderClick={(path) => {}}
        />

        {/* Temp Folder */}
        {showTempFolder && <TempFolder appRoot={appRoot} />}
      </aside>

      {/* Modals */}
      <AnimatePresence>
        {false && null} {/* NewProjectModal agora está dentro do ProjectSelector */}
      </AnimatePresence>
    </>
  )
}