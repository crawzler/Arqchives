'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, ChevronDown, Music2, ChevronLeft, Image as ImageIcon, Grid, List, FolderOpen, ListMusic } from 'lucide-react'
import { useAppStore, useActiveProjectId, useAlbum, useTrack, useAddTracksToQueue, useSetPlaylistOpen, useAddAlbumToQueue, useActiveProject, usePlaylistIsOpen } from '@/store/useAppStore'
import { PlaylistPanel } from '@/components/player/PlaylistPanel'
import { useFileOperations, usePathGenerator, useAlbumOperations } from '@/hooks/useAlbumOperations'
import { Button } from '@/components/ui/Button'
import { cn, generateId } from '@/lib/utils'
import AlbumCard from './AlbumCard'
import { TrackCard } from './TrackCard'

import TrackDetail from './TrackDetail'
import { AlbumTabs } from '@/components/project/AlbumTabs'
import { AlbumFilesTab } from '@/components/project/AlbumFilesTab'
import { AlbumSocialTab } from '@/components/project/AlbumSocialTab'
import { AlbumTodos } from '@/components/project/AlbumTodos'
import { TrackModal } from '@/components/modals/TrackModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { BatchStatusModal } from '@/components/modals/BatchStatusModal'
import { TrackRow } from '@/components/project/TrackRow'
import { ContextMenu, useContextMenu, createTrackContextMenuItems } from '@/components/ui/ContextMenu'
import type { ContextMenuItem } from '@/components/ui/ContextMenu'
import { NewAlbumModal } from '@/components/modals/NewAlbumModal'
import { Project } from '@/types'
import { Album } from '@/types'

export default function ProjectOverview({ project }: { project: Project }) {
  const { albums, deleteAlbum, activeProjectId, updateAlbum } = useAppStore()
  const { addAlbum: addAlbumWithFolders, organizeFile } = useAlbumOperations()
  const { revealFile, getLocalUrl } = useFileOperations()
  const { generateProjectPaths, generateAlbumPaths } = usePathGenerator()
  const setPlaylistOpen = useSetPlaylistOpen()
  const isPlaylistOpen = usePlaylistIsOpen()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [trackViewMode, setTrackViewMode] = useState<'grid' | 'list'>('list')
  const [filterType, setFilterType] = useState<'all' | 'album' | 'ep' | 'single' | 'compilation'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewAlbum, setShowNewAlbum] = useState(false)
  const [showEditAlbum, setShowEditAlbum] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<import('@/types').Track | null>(null)
  const [albumCoverSrc, setAlbumCoverSrc] = useState<string | null>(null)

  // Check if project has any audio tracks
  const hasProjectAudio = useAppStore((state) => {
    const projectAlbums = state.albums[activeProjectId!] || []
    return projectAlbums.some((album: any) => 
      album.tracks?.some((t: any) => t.audioVersions?.length > 0)
    )
  })

  // Add entire project to playlist
  const handleAddProjectToPlaylist = async () => {
    const { albums } = useAppStore.getState()
    const projectAlbums = albums[activeProjectId!] || []
    const playlistTracks = []
    for (const album of projectAlbums) {
      const tracksWithAudio = album.tracks?.filter((t: any) => t.audioVersions?.length > 0) || []
      for (const track of tracksWithAudio) {
        if (track.audioVersions?.[0]?.path) {
          const audioPath = await getLocalUrl(track.audioVersions[0].path)
          if (audioPath) {
            playlistTracks.push({
              track,
              album,
              project,
              audioVersion: track.audioVersions[0],
              audioPath,
            })
          }
        }
      }
    }
    if (playlistTracks.length > 0) {
      addTracksToQueue(playlistTracks, { playImmediately: true })
      setPlaylistOpen(true)
    }
  }

  // Get current album from store by ID
  const selectedAlbum = useAppStore((state) => 
    state.albums[activeProjectId!]?.find(a => a.id === selectedAlbumId) || null
  )

  // Listen for navigation events from Sidebar
  useEffect(() => {
    const normalizePath = (p: string) => p.replace(/\\$/, '').toLowerCase()
    
    const handleNavigate = (e: any) => {
      const { path } = e.detail
      const normalizedPath = normalizePath(path)
      
      // Handle back to project root
      const projectRoot = generateProjectPaths(project.name)?.projectPath
      if (projectRoot && normalizedPath === normalizePath(projectRoot)) {
        setSelectedAlbumId(null)
        setSelectedTrack(null)
        return
      }
      
      // First try to match album path
      let targetAlbum = albums[activeProjectId!]?.find(album => {
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        const albumPathNorm = normalizePath(paths.albumPath)
        return normalizedPath === albumPathNorm
      })
      
      if (targetAlbum) {
        setSelectedAlbumId(targetAlbum.id)
        return
      }
      
      // If not album, try to match track path
      for (const album of albums[activeProjectId!] || []) {
        for (const track of album.tracks || []) {
          const paths = generateAlbumPaths(project.name, album.title, track.title, track.number, album.type)
          if (paths.trackPath) {
            const trackPathNorm = normalizePath(paths.trackPath)
            if (normalizedPath === trackPathNorm) {
              setSelectedAlbumId(album.id)
              setSelectedTrack(track)
              return
            }
          }
        }
      }
    }
    window.addEventListener('arqchives:navigate', handleNavigate)
    return () => window.removeEventListener('arqchives:navigate', handleNavigate)
  }, [albums, activeProjectId, project, generateAlbumPaths])

  // Emit event when album selection changes for Sidebar sync
  useEffect(() => {
    if (selectedAlbumId) {
      const album = albums[activeProjectId!]?.find(a => a.id === selectedAlbumId)
      if (album) {
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        window.dispatchEvent(new CustomEvent('arqchives:album-selected', { detail: { path: paths.albumPath } }))
      }
    }
  }, [selectedAlbumId, albums, activeProjectId, project, generateAlbumPaths])

  // Emit event when track selection changes for Sidebar sync
  useEffect(() => {
    if (selectedTrack && selectedAlbumId) {
      const album = albums[activeProjectId!]?.find(a => a.id === selectedAlbumId)
      if (album) {
        const paths = generateAlbumPaths(project.name, album.title, selectedTrack.title, selectedTrack.number, album.type)
        if (paths.trackPath) {
          window.dispatchEvent(new CustomEvent('arqchives:track-selected', { detail: { path: paths.trackPath, albumPath: paths.albumPath } }))
        }
      }
    }
  }, [selectedTrack, selectedAlbumId, albums, activeProjectId, project, generateAlbumPaths])

 // Load album cover when selectedAlbum changes
  useEffect(() => {
    if (selectedAlbum?.coverPath) {
      if (selectedAlbum.coverPath.startsWith('data:')) {
        setAlbumCoverSrc(selectedAlbum.coverPath)
      } else {
        getLocalUrl(selectedAlbum.coverPath).then(setAlbumCoverSrc)
      }
    } else {
      setAlbumCoverSrc(null)
    }
  }, [selectedAlbum?.coverPath])

  const handleEditAlbum = (e: React.MouseEvent, album: Album) => {
    e.stopPropagation()
    setEditingAlbum(album)
    setShowEditAlbum(true)
  }

  const handleSubmitEdit = async (data: any) => {
    if (editingAlbum) {
      // If coverFilePath is provided, organize it first
      if (data.coverFilePath) {
        const organizedCoverPath = await organizeFile(data.coverFilePath, project.name, editingAlbum.title)
        updateAlbum(activeProjectId!, editingAlbum.id, { ...data, coverPath: organizedCoverPath })
      } else {
        updateAlbum(activeProjectId!, editingAlbum.id, data)
      }
      setShowEditAlbum(false)
      setEditingAlbum(null)
    }
  }

  // Filtra álbuns
  const filteredAlbums = (activeProjectId && albums[activeProjectId]) ? albums[activeProjectId].filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || album.type.toLowerCase() === filterType
    return matchesSearch && matchesType
  }) : []

  const projectPaths = generateProjectPaths(project.name)

  const handleOpenAlbum = (album: import('@/types').Album) => {
    setSelectedAlbumId(album.id)
  }

  const handleOpenTrack = (track: import('@/types').Track, album: import('@/types').Album) => {
    setSelectedTrack(track)
  }

  const handleBackToAlbums = () => {
    setSelectedAlbumId(null)
    setSelectedTrack(null)
    // Emit event to sync sidebar back to project root
    window.dispatchEvent(new CustomEvent('arqchives:navigate', { detail: { path: generateProjectPaths(project.name)?.projectPath || '' } }))
  }

  const handleBackToAlbum = () => {
    setSelectedTrack(null)
    // Emit event to sync sidebar to album folder
    if (selectedAlbumId) {
      const album = albums[activeProjectId!]?.find(a => a.id === selectedAlbumId)
      if (album) {
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        window.dispatchEvent(new CustomEvent('arqchives:album-selected', { detail: { path: paths.albumPath } }))
      }
    }
  }

  const isAlbumView = !!selectedAlbumId && !selectedTrack
  const isTrackView = !!selectedTrack

  return (
    <div className="flex flex-col h-full">
      {/* Unified Header - always shows search/filter/view controls, left side switches */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-10"
        style={{ borderColor: project.accent + '40' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side: Project info OR Album info with back button */}
          <AnimatePresence mode="wait">
            {(isAlbumView || isTrackView) && selectedAlbum ? (
              <motion.div
                key="album-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 min-w-0 flex-1"
              >
                {/* Discreet back button - just icon */}
                <button
                  onClick={isTrackView ? handleBackToAlbum : handleBackToAlbums}
                  className="w-8 h-8 rounded-lg bg-neutral-900/30 border border-neutral-700/30 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900/50 hover:border-neutral-600/50 trans-all focus-ring flex-shrink-0"
                  title="Voltar"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Album cover - subtle, smaller */}
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: project.accent + '08' }}>
                  {albumCoverSrc ? (
                    <img src={albumCoverSrc} alt="" className="w-full h-full object-cover opacity-90" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {selectedAlbum ? (
                        <span className="text-2xl opacity-50">{selectedAlbum.type === 'Single' ? '🎵' : '💿'}</span>
                      ) : (
                        <span className="text-2xl opacity-50">💿</span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => window.electronAPI?.selectFiles({
                      title: 'Selecionar capa',
                      filters: [{ name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
                      multiple: false,
                    }).then(r => r?.[0] && selectedAlbum && updateAlbum(project.id, selectedAlbum.id, { coverPath: r[0] }))}
                    className="absolute inset-0 bg-black/0 hover:bg-black/30 trans-colors flex items-center justify-center focus-ring"
                    title="Trocar capa"
                  >
                    <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 trans-opacity" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    {selectedAlbum && (
                      <>
                        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{selectedAlbum.type}</span>
                        <span className="text-xs text-neutral-500">·</span>
                        <span className="text-xs text-neutral-400">{selectedAlbum.year}</span>
                      </>
                    )}
                    <h1 className="text-lg font-semibold text-white truncate">{selectedAlbum?.title || 'Álbum'}</h1>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="project-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3"
              >
                {project.photo ? (
                  <img src={project.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: project.accent + '20' }}>
                    <span>🎵</span>
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-white truncate">{project.name}</h1>
                  <p className="text-sm text-neutral-400 truncate">{project.genre} · {filteredAlbums.length} {filteredAlbums.length === 1 ? 'álbum' : 'álbuns'}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right side: ALWAYS VISIBLE - Search, Filter, View Mode, Actions */}
          <div className="flex items-center gap-2 flex-wrap flex-1 sm:flex-none justify-end">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder={isAlbumView ? "Buscar faixas..." : "Buscar álbuns..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-64 sm:w-72 h-[var(--input-height)] bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus-ring"
              />
            </div>

            {/* Filter - only in grid view */}
            {!isAlbumView && !isTrackView && (
              <div className="relative hidden sm:block">
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value as any)}
                  className="h-[var(--input-height)] bg-neutral-900 border border-neutral-700 rounded-lg px-3 text-sm text-white focus-ring appearance-none pr-8"
                >
                  <option value="all">Todos</option>
                  <option value="album">Álbum</option>
                  <option value="ep">EP</option>
                  <option value="single">Single</option>
                  <option value="compilation">Compilação</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>
            )}

            {/* View Mode - album grid/list (project view) or track grid/list (album view) */}
            <div className="flex bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden hidden sm:flex">
              <button
                onClick={() => isAlbumView ? setTrackViewMode('grid') : setViewMode('grid')}
                className={cn(
                  "p-2 trans-colors focus-ring",
                  (isAlbumView ? trackViewMode : viewMode) === 'grid' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
                )}
                title={isAlbumView ? "Grade (faixas)" : "Grade (álbuns)"}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => isAlbumView ? setTrackViewMode('list') : setViewMode('list')}
                className={cn(
                  "p-2 trans-colors focus-ring",
                  (isAlbumView ? trackViewMode : viewMode) === 'list' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
                )}
                title={isAlbumView ? "Lista (faixas)" : "Lista (álbuns)"}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* New Album - only in project view (not album/track view) */}
            {!isAlbumView && !isTrackView && (
              <Button
                size="md"
                className="h-[var(--input-height)]"
                onClick={() => setShowNewAlbum(true)}
                style={{ '--accent': project.accent } as React.CSSProperties }
              >
                <Plus className="w-4 h-4" />
                <span>Novo</span>
              </Button>
            )}

            {/* New Track - only in album view */}
            {isAlbumView && !isTrackView && (
              <Button
                size="md"
                className="h-[var(--input-height)]"
                onClick={() => {
                  // Dispatch event to AlbumDetailContent to open track modal
                  window.dispatchEvent(new CustomEvent('arqchives:new-track'))
                }}
                style={{ '--accent': project.accent } as React.CSSProperties }
              >
                <Plus className="w-4 h-4" />
                <span>Nova faixa</span>
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Content - flex row: main content + playlist */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-hidden p-4">
          <AnimatePresence mode="wait">
            {/* Track Detail */}
            {selectedTrack && selectedAlbum && (
              <TrackDetail
                key={selectedTrack.id}
                trackId={selectedTrack.id}
                albumId={selectedAlbum.id}
                project={project}
                onBack={handleBackToAlbum}
                trackViewMode={trackViewMode}
              />
            )}

            {/* Album Detail (without header - tabs + content only) */}
            {selectedAlbum && !selectedTrack && (
              <AlbumDetailContent
                key={selectedAlbum.id}
                albumId={selectedAlbum.id}
                project={project}
                onOpenTrack={handleOpenTrack}
                trackViewMode={trackViewMode}
                setTrackViewMode={setTrackViewMode}
                selectedAlbum={selectedAlbum}
              />
            )}

            {/* Album Grid/List */}
            {!selectedAlbum && !selectedTrack && (
              <AlbumGrid
                albums={filteredAlbums}
                viewMode={viewMode}
                project={project}
                onOpenAlbum={handleOpenAlbum}
                onEditAlbum={handleEditAlbum}
              />
            )}
          </AnimatePresence>
        </main>

        {/* Playlist Panel - inline in flex flow */}
        {isPlaylistOpen && (
          <div className="w-[280px] flex-shrink-0 bg-neutral-900 border-l border-neutral-800 flex flex-col h-full">
            <PlaylistPanel
              isOpen={true}
              onClose={() => setPlaylistOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewAlbum && (
          <NewAlbumModal
            open={showNewAlbum}
            onClose={() => setShowNewAlbum(false)}
            onSubmit={async (data) => {
              await addAlbumWithFolders(data)
              setShowNewAlbum(false)
            }}
          />
        )}
        {showEditAlbum && editingAlbum && (
          <NewAlbumModal
            open={showEditAlbum}
            onClose={() => { setShowEditAlbum(false); setEditingAlbum(null); }}
            onSubmit={handleSubmitEdit}
            initialData={editingAlbum}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Album Detail Content (without header) ─────────────────────────────────────────
function AlbumDetailContent({ albumId, project, onOpenTrack, trackViewMode, selectedAlbum }: {
  albumId: string
  project: Project
  onOpenTrack: (track: import('@/types').Track) => void
  trackViewMode: 'grid' | 'list'
  selectedAlbum: import('@/types').Album | null
}) {
  const { updateAlbum, deleteAlbum, addTrack, updateTrack, deleteTrack, addAlbumFile } = useAppStore()
  const { getLocalUrl, revealFile, openFile, deleteFile, renameFile, ensureFolder } = useFileOperations()
  const { organizeFile, createFolderStructure, generateAlbumPaths } = useAlbumOperations()

  const [activeTab, setActiveTab] = useState<'tracklist' | 'files' | 'social'>('tracklist')
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [editingTrack, setEditingTrack] = useState<import('@/types').Track | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<import('@/types').Track | null>(null)
  const [pendingDropPaths, setPendingDropPaths] = useState<string[] | null>(null)
  const [showTodos, setShowTodos] = useState(false)
  const todoTriggerRef = useRef<HTMLButtonElement>(null)

  const album = selectedAlbum
  const paths = album ? generateAlbumPaths(project.name, album.title, undefined, undefined, album.type) : { albumPath: '', albumSubfolders: {} }

  // Listen for new track event from header button
  useEffect(() => {
    const handleNewTrack = () => {
      setEditingTrack(null)
      setShowTrackModal(true)
    }
    window.addEventListener('arqchives:new-track', handleNewTrack)
    return () => window.removeEventListener('arqchives:new-track', handleNewTrack)
  }, [])

  const handleDropFiles = (droppedPaths: string[]) => {
    // Filter out any undefined/null paths
    const validPaths = droppedPaths.filter((p): p is string => typeof p === 'string' && p.length > 0)
    if (validPaths.length === 0) {
      return
    }
    setPendingDropPaths(validPaths)
  }

  const handleConfirmBatchStatus = async (status: import('@/types').TrackStatus) => {
    if (!pendingDropPaths || pendingDropPaths.length === 0) {
      return
    }
    // Ensure all paths are valid strings
    const validPaths = pendingDropPaths.filter((p): p is string => typeof p === 'string' && p.length > 0)
    if (validPaths.length === 0) {
      setPendingDropPaths(null)
      return
    }
    const sorted = [...validPaths].sort((a, b) => {
      const aName = a.split(/[\\/]/).pop() ?? ''
      const bName = b.split(/[\\/]/).pop() ?? ''
      return aName.localeCompare(bName, undefined, { numeric: true })
    })
    for (const filePath of sorted) {
      const fileName = filePath.split(/[\\/]/).pop()
      if (!fileName) {
        continue
      }
      const nameWithoutExt = fileName.replace(/\.[^.]+$/, '')
      const { number, title } = parseTrackName(nameWithoutExt)
      const finalPath = await organizeFile(filePath, project.name, album.title, title, number)
      addTrack(project.id, album.id, {
        title,
        number,
        audioVersions: [{ id: generateId(), label: 'Pré-Mix', type: 'mix', path: finalPath, createdAt: Date.now() }],
        status
      })
    }
    setPendingDropPaths(null)
  }

  const handleSaveTrack = async (form: any) => {
    if (!album) {
      return
    }
    // If user selected a new audio file (audioPath differs from existing), organize it
    // Otherwise preserve existing audioVersions from form
    let audioVersions = form.audioVersions || []
    const existingAudioPath = editingTrack?.audioVersions?.[0]?.path
    
    if (form.audioPath && form.audioPath !== existingAudioPath) {
      const trackPaths = generateAlbumPaths(project.name, album.title, form.title, form.number, album.type)
      const organizedPath = await organizeFile(form.audioPath, project.name, album.title, form.title, form.number)
      // Create AudioVersion object from the organized path
      audioVersions = [{
        id: generateId(),
        label: 'Pré-Mix',
        type: 'mix',
        path: organizedPath,
        createdAt: Date.now()
      }]
    } else if (form.audioPath && form.audioPath === existingAudioPath) {
      // Same file - keep existing audioVersions (already in form.audioVersions)
    }
    
    // Remove audioPath from form since Track type uses audioVersions
    const { audioPath, ...formWithoutAudioPath } = form
    if (editingTrack) {
      updateTrack(project.id, album.id, editingTrack.id, { ...formWithoutAudioPath, audioVersions })
    } else {
      addTrack(project.id, album.id, { ...formWithoutAudioPath, audioVersions })
    }
    setShowTrackModal(false)
    setEditingTrack(null)
  }

  const confirmDeleteTrack = async () => {
    if (!confirmDelete) return
    const track = confirmDelete
    if (paths.trackPath) await deleteFile(paths.trackPath)
    deleteTrack(project.id, album.id, track.id)
    setConfirmDelete(null)
  }

  const tracks = [...(album.tracks || [])].sort((a, b) => {
    const na = parseInt(a.number) || 0
    const nb = parseInt(b.number) || 0
    return na !== nb ? na - nb : a.title.localeCompare(b.title)
  })

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-950/30 sticky top-0 z-10"
      >
        <AlbumTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          projectColor={project.accent}
          trackCount={tracks.length}
        />
      </motion.div>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-auto p-4"
      >
        {activeTab === 'tracklist' && (
          <Tracklist
            tracks={tracks}
            projectColor={project.accent}
            onOpenTrack={onOpenTrack}
            onEdit={setEditingTrack}
            onDelete={setConfirmDelete}
            onDropFiles={handleDropFiles}
            onAddManual={() => { setEditingTrack(null); setShowTrackModal(true) }}
            album={selectedAlbum}
            project={project}
            paths={paths}
            trackViewMode={trackViewMode}
          />
        )}

        {activeTab === 'files' && (
          <AlbumFilesTab
            album={album}
            project={project}
            paths={paths}
            onAddFile={async (filePath) => {
              const dest = paths.albumSubfolders.artwork
              const finalPath = await organizeFile(filePath, project.name, album.title)
              addAlbumFile(project.id, album.id, finalPath)
            }}
            viewMode={trackViewMode}
          />
        )}

        {activeTab === 'social' && (
          <AlbumSocialTab
            album={album}
            projectColor={project.accent}
            onSave={(changes) => updateAlbum(project.id, album.id, changes)}
          />
        )}
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {showTrackModal && (
          <TrackModal
            track={editingTrack}
            projectColor={project.accent}
            onSave={handleSaveTrack}
            onClose={() => { setShowTrackModal(false); setEditingTrack(null) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmModal
            message={`Deletar "${confirmDelete.title}"? Esta ação não pode ser desfeita.`}
            onConfirm={confirmDeleteTrack}
            onClose={() => setConfirmDelete(null)}
            variant="danger"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Album Grid/List Component ──────────────────────────────────────────────────
function AlbumGrid({ albums, viewMode, project, onOpenAlbum, onEditAlbum }: {
  albums: import('@/types').Album[]
  viewMode: 'grid' | 'list'
  project: Project
  onOpenAlbum: (album: import('@/types').Album) => void
  onEditAlbum: (e: React.MouseEvent, album: import('@/types').Album) => void
}) {
  if (albums.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full text-center"
      >
        {/* Animated background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
            style={{ backgroundColor: project.accent }} />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 animate-pulse" 
            style={{ animationDelay: '1s', backgroundColor: project.accent }} />
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto px-4">
          {/* Icon with glow effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto relative"
              style={{ background: `linear-gradient(135deg, ${project.accent}20 0%, ${project.accent}05 100%)`, border: `1px solid ${project.accent}40` }}>
              <div className="absolute inset-0 rounded-3xl blur-xl opacity-30" style={{ backgroundColor: project.accent }} />
              <Music2 className="w-12 h-12 text-white relative" style={{ color: project.accent }} />
            </div>
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl border-2"
              style={{ borderColor: project.accent, transformOrigin: 'center' }} />
          </motion.div>

          {/* Title & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum álbum ainda</h2>
            <p className="text-neutral-400 text-base leading-relaxed max-w-md">
              Sua biblioteca está vazia. Crie seu primeiro álbum ou importe pastas existentes
              sincronizando o projeto.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
          >
            <Button
              size="lg"
              className="w-full gap-2 group"
              style={{ '--accent': project.accent } as React.CSSProperties }
              onClick={() => {
                window.dispatchEvent(new CustomEvent('arqchives:new-album'))
              }}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Criar Álbum</span>
            </Button>
            
          </motion.div>

          {/* Quick tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 pt-4 border-t border-neutral-800/50 w-full max-w-lg"
          >
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3">O que você pode fazer</p>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                { icon: '💿', label: 'Álbuns completos', desc: 'Múltiplas faixas, arte, stems' },
                { icon: '🎵', label: 'Singles & EPs', desc: 'Lançamentos curtos e rápidos' },
                { icon: '📁', label: 'Importar pasta', desc: 'Arraste pastas para cá' },
                { icon: '⚙️', label: 'Configurações', desc: 'Tags, pastas, templates' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800/50 hover:border-neutral-700/50 transition-colors group"
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-white text-sm">{item.label}</p>
                    <p className="text-[11px] text-neutral-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <AlbumCard album={album} project={project} projectColor={project.accent} onClick={() => onOpenAlbum(album)} onEdit={onEditAlbum} />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <AlbumListItem album={album} projectColor={project.accent} onClick={() => onOpenAlbum(album)} />
        </motion.div>
      ))}
    </div>
  )
}

// ── Album List Item ────────────────────────────────────────────────────────────
function AlbumListItem({ album, projectColor, onClick }: {
  album: import('@/types').Album
  projectColor: string
  onClick: () => void
}) {
  const { getLocalUrl } = useFileOperations()
  const addAlbumToQueue = useAddAlbumToQueue()
  const activeProject = useActiveProject()
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Álbum': return 'bg-blue-500/20 text-blue-400'
      case 'EP': return 'bg-green-500/20 text-green-400'
      case 'Single': return 'bg-purple-500/20 text-purple-400'
      case 'Compilação': return 'bg-amber-500/20 text-amber-400'
      default: return 'bg-neutral-500/20 text-neutral-400'
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!activeProject) return

    const items: ContextMenuItem[] = [
      {
        label: 'Adicionar álbum à playlist',
        icon: <ListMusic className="w-4 h-4" />,
        onClick: () => addAlbumToQueue(album, activeProject, { playImmediately: true }),
      },
    ]

    openMenu(e, items)
  }

  useEffect(() => {
    if (album.coverPath) {
      if (album.coverPath.startsWith('data:')) {
        setCoverUrl(album.coverPath)
      } else {
        getLocalUrl(album.coverPath).then(setCoverUrl)
      }
    } else {
      setCoverUrl(null)
    }
  }, [album.coverPath, getLocalUrl])

  return (
    <>
      <button
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={cn(
          "w-full flex items-center gap-4 p-3 rounded-lg bg-neutral-900/50 border border-neutral-800",
          "hover:border-neutral-700 hover:bg-neutral-900 trans-all text-left focus-ring"
        )}
      >
        <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: projectColor + '10' }}>
          {coverUrl ? (
            <img src={coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">{album.type === 'Single' ? '🎵' : '💿'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white truncate">{album.title}</h3>
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", getTypeColor(album.type))}>
              {album.type}
            </span>
          </div>
          <p className="text-sm text-neutral-400 truncate">{album.tracks.length} faixas · {album.year}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">{album.todos?.filter(t => !t.done).length || 0} tarefas</p>
        </div>
      </button>

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

// ── Tracklist Component ────────────────────────────────────────────────────────
function Tracklist({ tracks, projectColor, onOpenTrack, onEdit, onDelete, onDropFiles, onAddManual, album, project, paths, trackViewMode }: {
  tracks: import('@/types').Track[]
  projectColor: string
  onOpenTrack: (track: import('@/types').Track) => void
  onEdit: (track: import('@/types').Track) => void
  onDelete: (track: import('@/types').Track) => void
  onDropFiles: (paths: string[]) => void
  onAddManual: () => void
  album: import('@/types').Album
  project: Project
  paths: import('@/types').AlbumPaths
  trackViewMode: 'grid' | 'list'
}) {
  const { ref: zoneRef, dragging } = useNativeDrop({ onDrop: onDropFiles, filterExts: ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma'] })
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()
  const [contextTrack, setContextTrack] = useState<import('@/types').Track | null>(null)
  const { revealFile, getLocalUrl } = useFileOperations()
  const addTracksToQueue = useAddTracksToQueue()
  const setPlaylistOpen = useSetPlaylistOpen()

  const handleAddTrackToPlaylist = async (track: import('@/types').Track) => {
    if (track.audioVersions?.[0]?.path) {
      const audioPath = await getLocalUrl(track.audioVersions[0].path)
      const currentQueueLength = useAppStore.getState().queue.length
      
      const playlistItem = {
        track,
        album,
        project,
        audioVersion: track.audioVersions[0],
        audioPath,
      }
      
      addTracksToQueue([playlistItem], { playImmediately: true })
      setPlaylistOpen(true)
      
      // Trigger immediate playback for this specific track
      window.dispatchEvent(new CustomEvent('arqchives:playlist-play', {
        detail: { 
          audioPath, 
          index: currentQueueLength, // The track we just added is at the end of the queue
          item: playlistItem
        }
      }))
    }
  }

  const handleTrackContextMenu = (e: React.MouseEvent, track: import('@/types').Track) => {
    setContextTrack(track)
    const trackFolderPath = paths.trackSubfolders?.track 
      || Object.values(paths.trackSubfolders || {})[0] 
      || paths.albumPath
    const items = createTrackContextMenuItems(
      track,
      () => onOpenTrack(track),
      () => { onEdit(track); onAddManual(); }, // onEdit sets editingTrack, onAddManual opens modal
      () => {
        navigator.clipboard.writeText(trackFolderPath)
      },
      async () => {
        await handleAddTrackToPlaylist(track)
      },
      () => onDelete(track)
    )
    openMenu(e, items)
  }

  const handleAddFiles = () => {
    window.electronAPI?.selectFiles({
      title: 'Adicionar músicas',
      filters: [{ name: 'Áudio', extensions: ['mp3', 'wav', 'flac', 'aiff', 'ogg', 'm4a', 'aac', 'wma'] }],
      multiple: true,
    }).then(r => r?.length && onDropFiles(r))
  }

  const EmptyState = () => (
    <div ref={zoneRef} className={cn("rounded-xl border-2 border-dashed border-neutral-700 p-12 text-center", dragging && "border-white/30 bg-white/5")}>
      <Music2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Arraste arquivos de áudio aqui</h3>
      <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
        Cada arquivo vira uma faixa automaticamente — número e título extraídos do nome do arquivo
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium trans-colors focus-ring"
          onClick={handleAddFiles}
        >
          Selecionar arquivos
        </button>
      </div>
    </div>
  )

  if (tracks.length === 0) {
    return <EmptyState />
  }

  const renderTrackList = () => (
    <>
      <div ref={zoneRef} className={cn("space-y-1", dragging && "bg-white/5")}>
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index + 1}
            projectColor={projectColor}
            albumCover={album.coverPath}
            onOpen={() => onOpenTrack(track)}
            onEdit={() => onEdit(track)}
            onDelete={() => onDelete(track)}
            onContextMenu={(e) => handleTrackContextMenu(e, track)}
            onAddToPlaylist={() => handleAddTrackToPlaylist(track)}
          />
        ))}
      </div>
    </>
  )

  const renderTrackGrid = () => (
    <>
      <div ref={zoneRef} className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", dragging && "bg-white/5")}>
        {tracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index + 1}
            projectColor={projectColor}
            albumCover={album.coverPath}
            onOpen={() => onOpenTrack(track)}
            onContextMenu={(e) => handleTrackContextMenu(e, track)}
            onAddToPlaylist={() => handleAddTrackToPlaylist(track)}
          />
        ))}
      </div>
    </>
  )

  return (
    <>
      {/* Content */}
      {trackViewMode === 'grid' ? renderTrackGrid() : renderTrackList()}

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

// ── Native Drop Hook (simplified) ──────────────────────────────────────────────
function useNativeDrop({ onDrop, filterExts }: { onDrop: (paths: string[]) => void; filterExts: string[] }) {
  const [dragging, setDragging] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!el.contains(e.relatedTarget as Node)) setDragging(false)
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'copy'
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const paths = files
        .filter(f => filterExts.some(ext => f.name.toLowerCase().endsWith(ext)))
        .map(f => f.path)

      if (paths.length) onDrop(paths)
    }

    el.addEventListener('dragenter', handleDragEnter)
    el.addEventListener('dragleave', handleDragLeave)
    el.addEventListener('dragover', handleDragOver)
    el.addEventListener('drop', handleDrop)

    return () => {
      el.removeEventListener('dragenter', handleDragEnter)
      el.removeEventListener('dragleave', handleDragLeave)
      el.removeEventListener('dragover', handleDragOver)
      el.removeEventListener('drop', handleDrop)
    }
  }, [onDrop, filterExts])

  return { ref, dragging }
}

// ── Parse Track Name ───────────────────────────────────────────────────────────
function parseTrackName(nameWithoutExt: string) {
  const s = nameWithoutExt.trim()
  const patterns = [
    /^(?:track\s*)?(\d+)\s*[-–.]\s*(.+)$/i,
    /^(\d+)\s+(.+)$/,
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) return { number: parseInt(m[1], 10).toString(), title: m[2].trim() }
  }
  return { number: '', title: s }
}