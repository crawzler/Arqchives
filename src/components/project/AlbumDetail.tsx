'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Plus, Music2, MoreVertical, Settings, Image as ImageIcon, Video, FileText, Trash2, Edit2, Copy, Download, ExternalLink, ListMusic } from 'lucide-react'
import { useAppStore, useActiveProjectId, useAlbum, useAddTracksToQueue, useSetPlaylistOpen } from '@/store/useAppStore'
import { useFileOperations, useAlbumOperations } from '@/hooks/useAlbumOperations'
import { cn, formatFileSize, generateId } from '@/lib/utils'
import { TrackRow } from '@/components/project/TrackRow'
import { ContextMenu, useContextMenu, createTrackContextMenuItems } from '@/components/ui/ContextMenu'
import { AlbumTabs } from '@/components/project/AlbumTabs'
import { AlbumFilesTab } from '@/components/project/AlbumFilesTab'
import { AlbumSocialTab } from '@/components/project/AlbumSocialTab'
import { AlbumTodos } from '@/components/project/AlbumTodos'
import { TrackModal } from '@/components/modals/TrackModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { BatchStatusModal } from '@/components/modals/BatchStatusModal'
import { PlaylistPanel } from '@/components/player/PlaylistPanel'

import { Project } from '@/types'

export default function AlbumDetail({ albumId, project, onBack, onOpenTrack }: {
  albumId: string
  project: Project
  onBack: () => void
  onOpenTrack: (track: import('@/types').Track) => void
}) {
  const activeProjectId = useActiveProjectId()
  const album = useAlbum(activeProjectId!, albumId)
  const { updateAlbum, deleteAlbum, addTrack, updateTrack, deleteTrack, addAlbumFile } = useAppStore()
  const { getLocalUrl, revealFile, openFile, deleteFile, renameFile, ensureFolder } = useFileOperations()
  const { organizeFile, createFolderStructure, generateAlbumPaths } = useAlbumOperations()

  const [activeTab, setActiveTab] = useState<'tracklist' | 'files' | 'social'>('tracklist')
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [editingTrack, setEditingTrack] = useState<import('@/types').Track | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<import('@/types').Track | null>(null)
  const [coverSrc, setCoverSrc] = useState<string | null>(null)
  const [pendingDropPaths, setPendingDropPaths] = useState<string[] | null>(null)
  const [showTodos, setShowTodos] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const todoTriggerRef = useRef<HTMLButtonElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)

  const addTracksToQueue = useAddTracksToQueue()
  const setPlaylistOpen = useSetPlaylistOpen()

  const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)

  const handleAddTrackToPlaylist = async (track: import('@/types').Track) => {
    if (track.audioVersions?.[0]?.path) {
      const audioPath = await getLocalUrl(track.audioVersions[0].path)
      const currentQueueLength = useAppStore.getState().queue.length
      
      const playlistItem = {
        track,
        album: album!,
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
          index: currentQueueLength,
          item: playlistItem
        }
      }))
    }
  }

  // Context menu for track rows
  const { menuX, menuY, menuItems, openMenu, closeMenu } = useContextMenu()
  const [contextTrack, setContextTrack] = useState<import('@/types').Track | null>(null)

  const handleTrackContextMenu = (e: React.MouseEvent, track: import('@/types').Track) => {
    setContextTrack(track)
    const trackFolderPath = paths.trackSubfolders?.track 
      || Object.values(paths.trackSubfolders || {})[0] 
      || paths.albumPath
    const items = createTrackContextMenuItems(
      track,
      () => onOpenTrack(track),
      () => { setEditingTrack(track); setShowTrackModal(true); },
      () => {
        navigator.clipboard.writeText(trackFolderPath)
      },
      async () => {
        await handleAddTrackToPlaylist(track)
      },
      () => {
        setConfirmDelete(track)
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
  }, [album.coverPath])

  const handleDropFiles = (droppedPaths: string[]) => {
    const validPaths = droppedPaths.filter((p): p is string => typeof p === 'string' && p.length > 0)
    if (validPaths.length === 0) return
    setPendingDropPaths(validPaths)
  }

  const handleConfirmBatchStatus = async (status: import('@/types').TrackStatus) => {
    if (!pendingDropPaths || pendingDropPaths.length === 0) return
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
      if (!fileName) continue
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
    let audioPath = form.audioPath
    if (audioPath) {
      const trackPaths = generateAlbumPaths(project.name, album.title, form.title, form.number, album.type)
      const destDir = trackPaths.trackSubfolders?.track 
        || Object.values(trackPaths.trackSubfolders || {})[0] 
        || paths.albumSubfolders?.track 
        || Object.values(paths.albumSubfolders || {})[0] 
        || paths.albumPath
      audioPath = await organizeFile(audioPath, project.name, album.title, form.title, form.number)
    }
    if (editingTrack) {
      updateTrack(project.id, album.id, editingTrack.id, { ...form, audioPath })
    } else {
      addTrack(project.id, album.id, { ...form, audioPath })
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

  const handleSelectCover = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Selecionar capa',
      filters: [{ name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
      multiple: false,
    })
    if (!result?.[0]) return
    const finalPath = await organizeFile(result[0], project.name, album.title)
    updateAlbum(project.id, album.id, { coverPath: finalPath })
  }

  const tracks = [...(album.tracks || [])].sort((a, b) => {
    const na = parseInt(a.number) || 0
    const nb = parseInt(b.number) || 0
    return na !== nb ? na - nb : a.title.localeCompare(b.title)
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-b border-neutral-800 bg-neutral-950/50 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0"
        style={{ borderColor: project.accent + '40' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 trans-colors focus-ring"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
            style={{ backgroundColor: project.accent + '10' }}>
            {coverSrc ? (
              <img src={coverSrc} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">{album.type === 'Single' ? '🎵' : '💿'}</span>
              </div>
            )}
            <button
              onClick={handleSelectCover}
              className="absolute inset-0 bg-black/0 hover:bg-black/40 trans-colors flex items-center justify-center focus-ring"
              title="Trocar capa"
            >
              <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 trans-opacity" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{album.type}</span>
              <span className="text-xs text-neutral-500">·</span>
              <span className="text-xs text-neutral-400">{album.year}</span>
            </div>
            <h1 className="text-xl font-bold text-white truncate mb-1">{album.title}</h1>
            {album.description && <p className="text-sm text-neutral-400 line-clamp-2">{album.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <AlbumTodos
              todos={album.todos || []}
              projectColor={project.accent}
              onToggle={(todoId) => {
                const todo = (album.todos || []).find(t => t.id === todoId)
                if (todo) updateAlbum(project.id, album.id, {
                  todos: album.todos!.map(t => t.id === todoId ? { ...t, done: !t.done } : t)
                })
              }}
              triggerRef={todoTriggerRef}
            />
            
            {/* Playlist button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowPlaylist(true)}
              className="text-neutral-400 hover:text-white"
            >
              <ListMusic className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Playlist</span>
            </Button>

            {/* Add Album to Playlist */}
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                const tracksWithAudio = album.tracks?.filter((t: any) => t.audioVersions?.length > 0) || []
                const playlistTracks = []
                for (const track of tracksWithAudio) {
                  let audioPath: string | undefined
                  if (track.audioVersions?.[0]?.path) {
                    audioPath = await getLocalUrl(track.audioVersions[0].path)
                  }
                  if (audioPath) {
                    playlistTracks.push({
                      track,
                      album: album!,
                      project,
                      audioVersion: track.audioVersions[0],
                      audioPath,
                    })
                  }
                }
                if (playlistTracks.length > 0) {
                  addTracksToQueue(playlistTracks, { playImmediately: true })
                }
              }}
              disabled={!album.tracks?.some((t: any) => t.audioVersions?.length > 0)}
              className="text-neutral-400 hover:text-white"
            >
              <ListMusic className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Adicionar álbum</span>
            </Button>

            {/* Add Project to Playlist */}
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                const { albums } = useAppStore.getState()
                const projectAlbums = albums[activeProjectId!] || []
                const playlistTracks = []
                for (const alb of projectAlbums) {
                  const tracksWithAudio = alb.tracks?.filter((t: any) => t.audioVersions?.length > 0) || []
                  for (const track of tracksWithAudio) {
                    if (track.audioVersions?.[0]?.path) {
                      const audioPath = await getLocalUrl(track.audioVersions[0].path)
                      if (audioPath) {
                        playlistTracks.push({
                          track,
                          album: alb,
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
                }
              }}
              disabled={!Object.values(useAppStore.getState().albums[activeProjectId!] || {}).some((a: any) => a.tracks?.some((t: any) => t.audioVersions?.length > 0))}
              className="text-neutral-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ListMusic className="w-4 h-4 mr-1.5" />
              <span className="text-xs">Adicionar projeto</span>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
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
            album={album}
            project={project}
            paths={paths}
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

      <AnimatePresence>
        {pendingDropPaths && (
          <BatchStatusModal
            count={pendingDropPaths.length}
            projectColor={project.accent}
            onConfirm={handleConfirmBatchStatus}
            onClose={() => setPendingDropPaths(null)}
          />
        )}
      </AnimatePresence>

      {/* Playlist Panel */}
      <PlaylistPanel
        isOpen={showPlaylist}
        onClose={() => setShowPlaylist(false)}
        projectColor={project.accent}
      />
    </div>
  )
}

// ── Tracklist Component ────────────────────────────────────────────────────────
function Tracklist({ tracks, projectColor, onOpenTrack, onEdit, onDelete, onDropFiles, onAddManual }: {
  tracks: import('@/types').Track[]
  projectColor: string
  onOpenTrack: (track: import('@/types').Track) => void
  onEdit: (track: import('@/types').Track) => void
  onDelete: (track: import('@/types').Track) => void
  onDropFiles: (paths: string[]) => void
  onAddManual: () => void
}) {
  const { ref: zoneRef, dragging } = useNativeDrop({ onDrop: onDropFiles, filterExts: ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma'] })

  if (tracks.length === 0) {
    return (
      <div ref={zoneRef} className={cn("rounded-xl border-2 border-dashed border-neutral-700 p-12 text-center", dragging && "border-white/30 bg-white/5")}>
        <Music2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Arraste arquivos de áudio aqui</h3>
        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
          Cada arquivo vira uma faixa automaticamente — número e título extraídos do nome do arquivo
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium trans-colors focus-ring"
            onClick={() => window.electronAPI?.selectFiles({
              title: 'Adicionar músicas',
              filters: [{ name: 'Áudio', extensions: ['mp3', 'wav', 'flac', 'aiff', 'ogg', 'm4a', 'aac', 'wma'] }],
              multiple: true,
            }).then(r => r?.length && onDropFiles(r))}
          >
            Selecionar arquivos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={zoneRef} className={cn("space-y-1", dragging && "bg-white/5")}>
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index + 1}
          projectColor={projectColor}
          onOpen={() => onOpenTrack(track)}
          onEdit={() => onEdit(track)}
          onDelete={() => onDelete(track)}
          onContextMenu={(e) => handleTrackContextMenu(e, track)}
          onAddToPlaylist={() => handleAddTrackToPlaylist(track)}
        />
      ))}
      {menuItems && (
        <ContextMenu
          items={menuItems}
          x={menuX}
          y={menuY}
          onClose={closeMenu}
        />
      )}
    </div>
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