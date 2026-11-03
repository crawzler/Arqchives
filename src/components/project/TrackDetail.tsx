'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Edit2, Trash2, Play, Pause } from 'lucide-react'
import { useAppStore, useActiveProjectId, useTrack, useAlbum, usePlaylistCurrentTrack, usePlaylistIsPlaying, useAddTracksToQueue } from '@/store/useAppStore'
import { useFileOperations, useAlbumOperations } from '@/hooks/useAlbumOperations'
import { cn, generateId } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { TrackModal } from '@/components/modals/TrackModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { TrackFilesTab } from '@/components/project/TrackFilesTab'
import { TrackSocialTab } from '@/components/project/TrackSocialTab'
import { TrackTabs } from '@/components/project/TrackTabs'
import { TrackAIInfoTab } from '@/components/project/TrackAIInfoTab'
import { Button } from '@/components/ui/Button'

import { Project } from '@/types'

export default function TrackDetail({ trackId, albumId, project, onBack, trackViewMode = 'grid' }: {
  trackId: string
  albumId: string
  project: Project
  onBack: () => void
  trackViewMode?: 'grid' | 'list'
}) {
  const activeProjectId = useActiveProjectId()
  const track = useTrack(activeProjectId!, albumId, trackId)
  const album = useAlbum(activeProjectId!, albumId)
  const { updateTrack, deleteTrack, addTrackFile } = useAppStore()
  const addTracksToQueue = useAddTracksToQueue()
  const { getLocalUrl, deleteFile, ensureFolder, moveOrCopyFile } = useFileOperations()
  const { organizeFile, generateAlbumPaths } = useAlbumOperations()

  const [activeTab, setActiveTab] = useState<'player' | 'files' | 'social' | 'info'>('player')
  const [showEditModal, setShowEditModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [coverSrc, setCoverSrc] = useState<string | null>(null)
  const [activeVersion, setActiveVersion] = useState<import('@/types').AudioVersion | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const paths = generateAlbumPaths(project.name, album.title, track.title, track.number, album.type)

  // Carrega capa do álbum
  useEffect(() => {
    if (album.coverPath) {
      if (album.coverPath.startsWith('data:')) {
        setCoverSrc(album.coverPath)
      } else {
        getLocalUrl(album.coverPath).then(setCoverSrc)
      }
    }
  }, [album.coverPath])

  // Seleciona versão de áudio ativa e converte para URL reproduzível
  const audioVersion = track.audioVersions?.[0] || null
  const audioPath = audioVersion?.path

  useEffect(() => {
    if (audioPath) {
      getLocalUrl(audioPath).then(setAudioUrl)
    } else {
      setAudioUrl(null)
    }
  }, [audioPath])

  const handleSaveTrack = async (form: any) => {
    const { audioPath: selectedAudioPath, audioVersions: formAudioVersions, ...trackChanges } = form
    let audioVersions: import('@/types').AudioVersion[] = formAudioVersions || track.audioVersions || []

    if (selectedAudioPath && selectedAudioPath !== track.audioVersions?.[0]?.path) {
      const organizedPath = await organizeFile(
        selectedAudioPath,
        project.name,
        album.title,
        form.title,
        form.number,
        undefined,
        album.type
      )
      const versionMode = trackChanges.versionMode || track.versionMode
      const newVersion: import('@/types').AudioVersion = {
        id: generateId(),
        label: versionMode === 'dual' ? 'Pré-Mix' : 'Master',
        type: versionMode === 'dual' ? 'mix' : 'master',
        path: organizedPath,
        createdAt: Date.now(),
      }
      audioVersions = audioVersions.length > 0
        ? [newVersion, ...audioVersions.slice(1)]
        : [newVersion]
    }

    updateTrack(project.id, album.id, track.id, { ...trackChanges, audioVersions })
    setShowEditModal(false)
  }

  const confirmDeleteTrack = async () => {
    if (paths.trackPath) await deleteFile(paths.trackPath)
    deleteTrack(project.id, album.id, track.id)
    onBack()
  }

  const handleAddFile = async (filePath: string) => {
    const dest = paths.trackSubfolders?.track 
      || Object.values(paths.trackSubfolders || {})[0] 
      || paths.albumSubfolders?.track 
      || Object.values(paths.albumSubfolders || {})[0] 
      || paths.albumPath
    await ensureFolder(dest)
    const result = await moveOrCopyFile({ srcPath: filePath, destFolder: dest, mode: 'copy' })
    if (result.ok) addTrackFile(project.id, album.id, track.id, result.newPath!)
  }

  const handleAddVersion = async (type: 'mix' | 'master' = 'master') => {
    const result = await window.electronAPI?.selectFiles({
      title: `Adicionar versão ${type === 'master' ? 'Master' : 'Mix'}`,
      filters: [{ name: 'Áudio', extensions: ['mp3', 'wav', 'flac', 'aiff', 'ogg', 'm4a', 'aac', 'wma'] }],
      multiple: false,
    })
    if (!result?.[0]) return
    const filePath = result[0]
    
    const dest = paths.trackSubfolders?.track 
      || Object.values(paths.trackSubfolders || {})[0] 
      || paths.albumPath
    await ensureFolder(dest)
    const copyResult = await moveOrCopyFile({ srcPath: filePath, destFolder: dest, mode: 'copy' })
    if (!copyResult.ok) return
    
    const newVersion = {
      id: generateId(),
      label: type === 'master' ? 'Master' : 'Mix',
      type,
      path: copyResult.newPath!,
      createdAt: Date.now(),
    }
    updateTrack(project.id, album.id, track.id, {
      audioVersions: [...(track.audioVersions || []), newVersion]
    })
  }

  // Format duration helper
  const formatDuration = useCallback((seconds: number | null) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="flex flex-col h-full min-h-0 bg-neutral-950">
      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-neutral-950/50 sticky top-0 z-10"
      >
        <TrackTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          projectColor={project.accent}
          hasAudio={!!audioPath}
        />
      </motion.div>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 min-h-0 overflow-hidden"
      >
        {activeTab === 'player' ? (
          <TrackDetailOverview
            track={track}
            album={album}
            project={project}
            projectColor={project.accent}
            audioPath={audioUrl}
            audioFilePath={audioPath}
            audioVersion={audioVersion}
            coverSrc={coverSrc}
            onAddVersion={handleAddVersion}
            getLocalUrl={getLocalUrl}
            activeVersion={activeVersion}
            setActiveVersion={setActiveVersion}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setConfirmDelete(true)}
            formatDuration={formatDuration}
            addTracksToQueue={addTracksToQueue}
          />
        ) : (
          // Other tabs: with padding and scroll
          <div className="h-full min-h-0 overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
            {activeTab === 'info' && (
              <TrackAIInfoTab
                track={track}
                projectColor={project.accent}
                onSave={(changes) => updateTrack(project.id, album.id, track.id, changes)}
              />
            )}

            {activeTab === 'files' && (
              <TrackFilesTab
                track={track}
                album={album}
                project={project}
                paths={paths}
                onAddFile={handleAddFile}
                viewMode={trackViewMode}
              />
            )}

            {activeTab === 'social' && (
              <TrackSocialTab
                track={track}
                album={album}
                projectColor={project.accent}
                onSave={(changes) => updateTrack(project.id, album.id, track.id, changes)}
              />
            )}
          </div>
        )}
      </motion.main>

      {/* Modals */}
      <AnimatePresence>
        {showEditModal && (
          <TrackModal
            track={track}
            projectColor={project.accent}
            onSave={handleSaveTrack}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmModal
            message={`Deletar "${track.title}"? Esta ação não pode ser desfeita.`}
            onConfirm={confirmDeleteTrack}
            onClose={() => setConfirmDelete(false)}
            variant="danger"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Track Detail Overview Component ─────────────────────────────────
interface TrackDetailOverviewProps {
  track: import('@/types').Track
  album: import('@/types').Album
  project: import('@/types').Project
  projectColor: string
  audioPath: string
  audioFilePath: string | undefined
  audioVersion: import('@/types').AudioVersion
  coverSrc: string | null
  onAddVersion: (type: 'mix' | 'master') => void
  getLocalUrl: (path: string) => Promise<string | null>
  activeVersion: import('@/types').AudioVersion | null
  setActiveVersion: (v: import('@/types').AudioVersion) => void
  onEdit?: () => void
  onDelete?: () => void
  formatDuration: (seconds: number | null) => string
  addTracksToQueue: (tracks: import('@/types').PlaylistTrack[], options?: { replace?: boolean; playImmediately?: boolean }) => void
}

function TrackDetailOverview({
  track,
  album,
  project,
  projectColor,
  audioPath,
  audioFilePath,
  audioVersion,
  coverSrc,
  onAddVersion,
  getLocalUrl,
  activeVersion,
  setActiveVersion,
  onEdit,
  onDelete,
  formatDuration,
  addTracksToQueue,
}: TrackDetailOverviewProps) {
  const currentTrack = usePlaylistCurrentTrack()
  const isPlaying = usePlaylistIsPlaying()

  const isCurrentTrack = currentTrack && currentTrack.track.id === track.id
  const isPlayingThisTrack = isCurrentTrack && isPlaying

  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>(audioFilePath)

  useEffect(() => {
    setCurrentFilePath(audioFilePath)
  }, [audioFilePath])

  const versionColors: Record<string, string> = {
    master: '#22c55e',
    mix: '#ffffff',
    draft: '#f59e0b',
    instrumental: '#8b5cf6',
    acapella: '#ec4899',
    other: '#ffffff',
  }

  const getChipStyle = (v: import('@/types').AudioVersion, isActive: boolean) => {
    if (isActive) {
      return { backgroundColor: projectColor, borderColor: 'transparent', color: '#000000' }
    }
    return { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)', color: '#ffffff' }
  }

  const isActiveVersion = (v: import('@/types').AudioVersion) =>
    activeVersion?.id === v.id || (!activeVersion && v.id === track.audioVersions?.[0]?.id)

  if (!audioPath) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center mb-8 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <Music2 className="w-20 h-20 text-neutral-600 relative z-10" />
        </div>
        <h3 className="text-2xl font-medium text-white mb-3">Nenhum arquivo de áudio</h3>
        <p className="text-neutral-500 mb-8 max-w-md text-center">Adicione uma versão de áudio na aba Arquivos ou edite a track para começar a reproduzir.</p>
        <Button onClick={onEdit} size="lg" style={{ '--accent': projectColor }}>
          Adicionar áudio
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-neutral-950">
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 py-8 h-full flex flex-col">
          {/* ── HEADER ZONE: Track Title Only (centered) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12 md:mb-16"
          >
            <div className="relative max-w-4xl mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: projectColor }} />
              </div>

              <div className="relative z-10 text-center">
                {/* Track title with number - larger */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                  {track.number ? `${track.number}. ` : ''}{track.title}
                </h1>
              </div>
            </div>
          </motion.div>

          {/* ── CANVAS + SIDEBAR: Cover | Versions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="relative max-w-7xl mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 -z-10" aria-hidden="true">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: projectColor }} />
              </div>

              <div className="relative z-10 grid lg:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-stretch flex-1 min-h-0">
                {/* CANVAS: Cover art - centered in left column */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative aspect-square max-w-[360px] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                    {coverSrc ? (
                      <img src={coverSrc} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                        <Music2 className="w-24 h-24 md:w-32 md:h-32 text-neutral-500" />
                      </div>
                    )}
                    {/* Playing ring indicator */}
                    {isPlayingThisTrack && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.15], opacity: [0.35, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                          className="absolute inset-0 rounded-2xl border-2"
                          style={{ borderColor: projectColor }} />
                        <motion.div
                          animate={{ scale: [1, 1.3], opacity: [0.25, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                          className="absolute inset-0 rounded-2xl border-2"
                          style={{ borderColor: projectColor }} />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center animate-pulse">
                            <Pause className="w-7 h-7 text-black ml-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* SIDEBAR: Versions panel */}
                {track.audioVersions && track.audioVersions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex-shrink-0 w-full"
                  >
                    <div className="bg-neutral-900/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 md:p-5 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Versões</p>
                        {track.versionMode === 'dual' && (
                          <Button variant="ghost" size="sm" onClick={() => onAddVersion('master')} className="gap-1.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="12" y1="5" x2="12" y2="19"/>
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            <span className="text-xs">+ Master</span>
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
                        {track.audioVersions.map(v => (
                          <button
                            key={v.id}
                            onClick={() => {
                                console.log('[TrackDetail] Play button clicked (sync)')
                                window.electronAPI?.debugLog('[TrackDetail] Play button clicked (sync)')
                                // Use setTimeout to allow React to process the click
                                setTimeout(async () => {
                                  try {
                                    console.log('[TrackDetail] Play button clicked (async)')
                                    window.electronAPI?.debugLog('[TrackDetail] Play button clicked (async)')
                                    setActiveVersion(v)
                                    const url = await getLocalUrl(v.path)
                                    window.electronAPI?.debugLog('[TrackDetail] getLocalUrl result', { url })
                                    if (url) {
                                      setCurrentFilePath(v.path)
                                      addTracksToQueue([{
                                        track,
                                        album,
                                        project,
                                        audioVersion: v,
                                        audioPath: url,
                                      }], { replace: true, playImmediately: true })
                                      // Dispatch event so App.tsx opens player and sets audioSrc
                                      console.log('[TrackDetail] Dispatching event with url:', url)
                                      window.electronAPI?.debugLog('[TrackDetail] Dispatching playlist-play event', { url })
                                      window.dispatchEvent(new CustomEvent('arqchives:playlist-play', {
                                        detail: { audioPath: url, index: 0, item: { track, album, project, audioVersion: v, audioPath: v.path } }
                                      }))
                                    } else {
                                      window.electronAPI?.debugLog('[TrackDetail] getLocalUrl returned null')
                                    }
                                  } catch (err) {
                                    console.error('[TrackDetail] Error in play button:', err)
                                    window.electronAPI?.debugLog('[TrackDetail] Error in play button', { error: String(err) })
                                  }
                                }, 0)
                              }}
                            className={cn(
                              "relative px-4 py-3 rounded-xl text-sm font-medium transition-all text-left w-full overflow-hidden",
                              isActiveVersion(v) ? "shadow-lg" : "hover:bg-white/5 before:hidden",
                              "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-300"
                            )}
                            style={getChipStyle(v, isActiveVersion(v))}
                          >
                            <div className="flex items-center gap-3 relative z-10">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: versionColors[v.type] || '#64748b' }} />
                              <span className="capitalize truncate flex-1">{v.label}</span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                                style={{
                                  backgroundColor: isActiveVersion(v) ? 'rgba(0,0,0,0.15)' : `${versionColors[v.type] || '#64748b'}25`,
                                  color: isActiveVersion(v) ? 'rgba(0,0,0,0.6)' : versionColors[v.type] || '#64748b'
                                }}
                              >
                                {v.type}
                              </span>
                            </div>
                            {isActiveVersion(v) && (
                              <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: projectColor }} />
                            )}
                            {isActiveVersion(v) && (
                              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-black relative z-10">
                                <Play className="w-3.5 h-3.5" />
                                <span className="truncate font-medium">Ouvir track</span>
                              </div>
                            )}
                          </button>
                        ))}
                        {/* Album + Track Info at bottom of panel */}
                        <div className="mt-6 pt-6 border-t border-white/10 px-2 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 uppercase tracking-wider"
                                style={{ borderColor: `${projectColor}40`, borderWidth: '1px', borderStyle: 'solid' }}>
                                {album.type}
                              </span>
                              <span className="w-px h-3 bg-neutral-600" />
                              <span className="text-xs font-mono text-neutral-400">{album.year}</span>
                              <span className="w-px h-3 bg-neutral-600" />
                              <span className="text-xs text-neutral-400 truncate max-w-[180px]">{album.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${TRACK_STATUSES[track.status].color}25`,
                                  color: TRACK_STATUSES[track.status].color,
                                  border: `1px solid ${TRACK_STATUSES[track.status].color}40`
                                }}
                              >
                                {TRACK_STATUSES[track.status].label}
                              </span>
                              {track.bpm && (
                                <span className="flex items-center gap-1 text-neutral-400">
                                  <Music2 className="w-3 h-3" />
                                  <span className="font-mono">{track.bpm} BPM</span>
                                </span>
                              )}
                              {track.key && (
                                <span className="flex items-center gap-1 text-neutral-400">
                                  <span className="text-xs">🎹</span>
                                  <span className="font-mono">{track.key}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}