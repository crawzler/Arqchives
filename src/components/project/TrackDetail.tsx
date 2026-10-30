'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music2, FileText, MessageSquare, Brain, Settings, Sparkles, Edit2, Trash2, Plus, Loader2 } from 'lucide-react'
import { useAppStore, useActiveProjectId, useTrack, useAlbum, usePlaylistCurrentTrack, usePlaylistIsPlaying, usePlaylistCurrentIndex } from '@/store/useAppStore'
import { useFileOperations, useAlbumOperations } from '@/hooks/useAlbumOperations'
import { cn, formatFileSize, generateId } from '@/lib/utils'
import { TRACK_STATUSES } from '@/types'
import { TrackModal } from '@/components/modals/TrackModal'
import { ConfirmModal } from '@/components/modals/ConfirmModal'
import { TrackFilesTab } from '@/components/project/TrackFilesTab'
import { TrackSocialTab } from '@/components/project/TrackSocialTab'
import { TrackTabs } from '@/components/project/TrackTabs'
import { TrackAIInfoTab } from '@/components/project/TrackAIInfoTab'
import { Waveform } from '@/components/player/Waveform'
import { ContextMenu, useContextMenu } from '@/components/ui/ContextMenu'
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
  const { getLocalUrl, revealFile, openFile, deleteFile, renameFile, ensureFolder, moveOrCopyFile } = useFileOperations()
  const { organizeFile, generateAlbumPaths } = useAlbumOperations()
  const { open: openContextMenu } = useContextMenu()

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
    let audioPath = form.audioPath
    if (audioPath) {
      audioPath = await organizeFile(audioPath, project.name, album.title, form.title, form.number)
    }
    updateTrack(project.id, album.id, track.id, { ...form, audioPath })
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

  const trackContextMenuItems = [
    { label: 'Editar', icon: Edit2, onClick: () => setShowEditModal(true) },
    { label: 'Adicionar versão Master', icon: Plus, onClick: () => handleAddVersion('master') },
    { label: 'Adicionar versão Mix', icon: Plus, onClick: () => handleAddVersion('mix') },
    { type: 'separator' as const },
    { label: 'Deletar faixa', icon: Trash2, variant: 'danger' as const, onClick: () => setConfirmDelete(true) },
  ]

  return (
    <div className="flex flex-col h-full bg-neutral-950">
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
        className="flex-1 min-h-0"
      >
        {activeTab === 'player' ? (
          // Player tab: full height, no padding, no scroll
          <TrackDetailPlayer
            track={track}
            album={album}
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
          />
        ) : (
          // Other tabs: with padding and scroll
          <div className="overflow-auto p-4 md:p-6 max-w-6xl mx-auto">
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

// ── Track Detail Player Component (compact controls for global player) ─────────────────────────────────
function TrackDetailPlayer({ track, album, projectColor, audioPath, audioFilePath, audioVersion, coverSrc, onAddVersion, getLocalUrl, activeVersion, setActiveVersion, onEdit, onDelete }: {
  track: import('@/types').Track
  album: import('@/types').Album
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
}) {
  const activeProjectId = useActiveProjectId()
  
  // Use global playlist state
  const currentTrack = usePlaylistCurrentTrack()
  const isPlaying = usePlaylistIsPlaying()
  const currentIndex = usePlaylistCurrentIndex()
  
  // Check if this track is the currently playing one
  const isCurrentTrack = currentTrack && currentTrack.track.id === track.id
  const isPlayingThisTrack = isCurrentTrack && isPlaying

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [audioMetadata, setAudioMetadata] = useState<{ duration: number | null; size: number; ext: string } | null>(null)
  const [currentFilePath, setCurrentFilePath] = useState<string | undefined>(audioFilePath)

  // Fetch audio metadata when currentFilePath changes (use actual file path, not file:// URL)
  useEffect(() => {
    if (currentFilePath) {
      window.electronAPI?.getAudioMetadata(currentFilePath).then((result) => {
        if (result) {
          setAudioMetadata({
            duration: result.duration,
            size: result.size,
            ext: currentFilePath.split('.').pop()?.toUpperCase() || ''
          })
        }
      }).catch(() => {
        // Ignore errors
      })
    } else {
      setAudioMetadata(null)
    }
  }, [currentFilePath])

  // Initialize currentFilePath from props
  useEffect(() => {
    setCurrentFilePath(audioFilePath)
  }, [audioFilePath])

  // Listen to global player events for time/duration sync
  useEffect(() => {
    const handleGlobalTimeUpdate = (e: CustomEvent) => {
      const { audioPath: globalAudioPath, time } = e.detail
      if (globalAudioPath === audioPath) {
        setCurrentTime(time)
      }
    }
    const handleGlobalDuration = (e: CustomEvent) => {
      const { audioPath: globalAudioPath, duration: globalDuration } = e.detail
      if (globalAudioPath === audioPath) {
        setDuration(globalDuration)
      }
    }
    const handleGlobalEnded = (e: CustomEvent) => {
      const { audioPath: globalAudioPath } = e.detail
      if (globalAudioPath === audioPath) {
        setCurrentTime(0)
        setDuration(0)
      }
    }

    window.addEventListener('arqchives:global-timeupdate', handleGlobalTimeUpdate as EventListener)
    window.addEventListener('arqchives:global-duration', handleGlobalDuration as EventListener)
    window.addEventListener('arqchives:audio-ended', handleGlobalEnded as EventListener)
    
    return () => {
      window.removeEventListener('arqchives:global-timeupdate', handleGlobalTimeUpdate as EventListener)
      window.removeEventListener('arqchives:global-duration', handleGlobalDuration as EventListener)
      window.removeEventListener('arqchives:audio-ended', handleGlobalEnded as EventListener)
    }
  }, [audioPath])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    // Dispatch to global player
    window.dispatchEvent(new CustomEvent('arqchives:global-volume', { detail: { audioPath, volume: vol } }))
    setVolume(vol)
  }

  if (!audioPath) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-8">
        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center mb-8 mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <Music2 className="w-20 h-20 text-neutral-600 relative z-10" />
        </div>
        <h3 className="text-2xl font-medium text-white mb-3">Nenhum arquivo de áudio</h3>
        <p className="text-neutral-500 mb-8 max-w-md text-center">Adicione uma versão de áudio na aba Arquivos ou edite a track para começar a reproduzir.</p>
        <Button onClick={() => { /* trigger edit modal */ }} size="lg" style={{ '--accent': projectColor }}>
          Adicionar áudio
        </Button>
      </div>
    )
  }

  const versionColors: Record<string, string> = {
    master: '#22c55e',
    mix: '#ffffff',
    draft: '#f59e0b',
    instrumental: '#8b5cf6',
    acapella: '#ec4899',
    other: '#ffffff',
  }

  // Consistent chip color: use projectColor for active, neutral for inactive
  // Type indicator dot uses versionColors but chips don't clash
  const getChipStyle = (v: import('@/types').AudioVersion, isActive: boolean) => {
    if (isActive) {
      return {
        backgroundColor: projectColor,
        borderColor: 'transparent',
        color: '#000000',
      }
    }
    return {
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderColor: 'rgba(255,255,255,0.06)',
      color: '#ffffff',
    }
  }

  const isActiveVersion = (v: import('@/types').AudioVersion) => 
    activeVersion?.id === v.id || (!activeVersion && v.id === track.audioVersions?.[0]?.id)

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Hero Section - Cover Left + Info Center + Versions Right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex-shrink-0 px-4 md:px-6 py-8"
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Cover Art - Rectangle (no play button overlay) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-shrink-0"
            >
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                {coverSrc ? (
                  <img src={coverSrc} alt={track.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <Music2 className="w-18 h-18 text-neutral-500" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Track Info - Center flex-1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="flex-1 min-w-0 text-center md:text-left"
            >
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 uppercase tracking-wide">
                  {album.type}
                </span>
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs font-mono text-neutral-400">{album.year}</span>
                <span className="text-xs text-neutral-500">·</span>
                <span className="text-xs text-neutral-400 truncate max-w-[180px]">{album.title}</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-white truncate mb-1.5 leading-tight">
                {track.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-neutral-400 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                  style={{
                    backgroundColor: `${TRACK_STATUSES[track.status].color}33`,
                    color: TRACK_STATUSES[track.status].color,
                    border: `1px solid ${TRACK_STATUSES[track.status].color}50`
                  }}
                >
                  {TRACK_STATUSES[track.status].label}
                </span>
              </div>

              {(track.bpm || track.key) && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                  {track.bpm && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-neutral-300">
                      <Music2 className="w-3.5 h-3.5" />
                      {track.bpm} BPM
                    </span>
                  )}
                  {track.key && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-neutral-300">
                      <span className="text-base">🎹</span>
                      {track.key}
                    </span>
                  )}
                </div>
              )}

              {/* Audio Metadata - Size, Extension (duration shown in timeline) */}
              {audioMetadata && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs mt-2">
                  {audioMetadata.size && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-neutral-300">
                      {audioMetadata.size >= 1024 * 1024 
                        ? `${(audioMetadata.size / 1024 / 1024).toFixed(1)} MB`
                        : `${Math.round(audioMetadata.size / 1024)} KB`}
                    </span>
                  )}
                  {audioMetadata.ext && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-full text-neutral-300 font-mono">
                      {audioMetadata.ext}
                    </span>
                  )}
                </div>
              )}

              {/* Edit & Delete Buttons */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  title="Editar faixa"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Editar</span>
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Excluir faixa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Excluir</span>
                </button>
              </div>
            </motion.div>

            {/* Versions - Right side of Hero */}
            {track.audioVersions && track.audioVersions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-shrink-0 w-full md:w-72 lg:w-80"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Versões</p>
                  {track.versionMode === 'dual' && (
                    <Button variant="ghost" size="sm" onClick={() => onAddVersion('master')}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      <span className="text-xs">+ Master</span>
                    </Button>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {track.audioVersions.map(v => (
                    <button
                      key={v.id}
                      onClick={async () => { 
                        setActiveVersion(v); 
                        // Dispatch to global player to switch version
                        if (v.path !== audioPath) {
                          const url = await getLocalUrl(v.path)
                          if (url) {
                            setCurrentFilePath(v.path)
                            window.dispatchEvent(new CustomEvent('arqchives:playlist-play', { 
                              detail: { audioPath: url, item: { track, album, audioVersion: v, audioPath: v.path }, index: currentIndex >= 0 ? currentIndex : 0 } 
                            }))
                          }
                        }
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap text-left w-full",
                        isActiveVersion(v) ? "shadow-md" : "hover:bg-white/5"
                      )}
                      style={getChipStyle(v, isActiveVersion(v))}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: versionColors[v.type] || '#64748b' }} />
                        <span className="capitalize text-sm truncate">{v.label}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full ml-auto"
                          style={{ 
                            backgroundColor: isActiveVersion(v) ? 'rgba(0,0,0,0.15)' : `${versionColors[v.type] || '#64748b'}25`,
                            color: isActiveVersion(v) ? 'rgba(0,0,0,0.6)' : versionColors[v.type] || '#64748b'
                          }}
                        >
                          {v.type}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Waveform & Controls Section - fills remaining space, no scroll */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex-1 flex flex-col min-h-0 px-4 md:px-6 pb-6 max-w-7xl mx-auto w-full"
      >
        {/* Volume bar above waveform - Far right */}
        <div className="mb-3 flex justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { /* mute toggle handled by global player */ }}
              className="w-8 h-8 rounded-full text-neutral-500 hover:text-white transition-colors"
              aria-label={volume === 0 ? 'Ativar som' : 'Mutar'}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-40 h-5 cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${projectColor} ${volume * 100}%, rgba(255,255,255,0.05) 0%)`,
              }}
            />
          </div>
        </div>

        {/* Waveform - visual only (seek handled by global player) */}
        <div className="relative mb-5 flex-shrink-0">
          <div className="bg-neutral-900/40 border rounded-xl p-3 md:p-4"
            style={{ borderColor: `${projectColor}25` }}
          >
            <Waveform
              audioPath={audioPath}
              currentTime={currentTime}
              duration={duration}
              color={projectColor}
              height={80}
              isPlaying={isPlaying}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}