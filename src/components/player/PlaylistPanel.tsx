'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronLeft,
  Play,
  Pause,
  Repeat,
  Shuffle,
  ListMusic,
  Clock,
  X,
  Music2,
  Eraser,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  usePlaylistQueue, 
  usePlaylistCurrentIndex, 
  usePlaylistIsPlaying, 
  usePlaylistRepeat, 
  usePlaylistShuffle, 
  usePlaylistCurrentTrack,
  useRemoveFromQueue,
  useSetCurrentIndex,
  useSetIsPlaying,
  useSetRepeat,
  useSetShuffle,
} from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'
import { useFileOperations } from '@/hooks/useAlbumOperations'

export function PlaylistPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void
}) {
  const queue = usePlaylistQueue()
  const currentIndex = usePlaylistCurrentIndex()
  const isPlaying = usePlaylistIsPlaying()
  const repeat = usePlaylistRepeat()
  const shuffle = usePlaylistShuffle()
  const currentTrack = usePlaylistCurrentTrack()
  
  const removeFromQueue = useRemoveFromQueue()
  const setCurrentIndex = useSetCurrentIndex()
  const setIsPlaying = useSetIsPlaying()
  const setRepeat = useSetRepeat()
  const setShuffle = useSetShuffle()
  const { getLocalUrl: getLocalUrlHook } = useFileOperations()
  
  const [trackDurations, setTrackDurations] = useState<Record<number, string>>({})
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearQueue = () => {
    // Keep only the currently playing track
    if (currentIndex >= 0 && currentIndex < queue.length) {
      const currentTrack = queue[currentIndex]
      useAppStore.setState({ queue: [currentTrack], currentIndex: 0 })
    } else {
      useAppStore.setState({ queue: [], currentIndex: -1, isPlaying: false })
    }
    setShowClearConfirm(false)
  }

  // Fetch duration for tracks in queue
  useEffect(() => {
    const fetchDurations = async () => {
      const durations: Record<number, string> = {}
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i]
        try {
          let audioPath = item.audioPath ?? undefined
          if (!audioPath && item.audioVersion?.path) {
            const url = await getLocalUrlHook(item.audioVersion.path)
            audioPath = url ?? undefined
          } else if (!audioPath && item.track.audioVersions?.[0]?.path) {
            const url = await getLocalUrlHook(item.track.audioVersions[0].path)
            audioPath = url ?? undefined
          }
          
          if (audioPath) {
            const audio = new Audio(audioPath)
            await new Promise<void>((resolve) => {
              audio.addEventListener('loadedmetadata', () => resolve())
              audio.addEventListener('error', () => resolve())
            })
            const mins = Math.floor(audio.duration / 60)
            const secs = Math.floor(audio.duration % 60)
            durations[i] = `${mins}:${secs.toString().padStart(2, '0')}`
          }
        } catch {
          durations[i] = '--:--'
        }
      }
      setTrackDurations(durations)
    }
    
    if (queue.length > 0) {
      fetchDurations()
    }
  }, [queue, getLocalUrlHook])

  const getAudioPath = async (item: typeof queue[0]) => {
    if (item.audioPath) return item.audioPath
    if (item.audioVersion?.path) {
      return await getLocalUrlHook(item.audioVersion.path)
    }
    if (item.track.audioVersions?.[0]?.path) {
      return await getLocalUrlHook(item.track.audioVersions[0].path)
    }
    return null
  }

  const playTrack = async (index: number) => {
    const item = queue[index]
    if (!item) return
    
    const audioPath = await getAudioPath(item)
    if (!audioPath) return
    
    setCurrentIndex(index)
    
    window.dispatchEvent(new CustomEvent('arqchives:playlist-play', {
      detail: { audioPath, item, index }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full bg-elevated" role="dialog" aria-label="Playlist">
      {/* Header - Solid background */}
      <header className="flex items-center justify-between px-md py-sm border-b border-subtle bg-elevated sticky top-0 z-sticky flex-shrink-0">
        <div className="flex items-center gap-sm">
          {/* Close/Hide button on the left */}
          <button
            onClick={onClose}
            className="w-7 h-7 radius-lg bg-hover hover:bg-default flex items-center justify-center text-muted hover:text-primary trans-colors"
            aria-label="Esconder playlist"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-primary truncate text-body-sm">Fila de Reprodução</h3>
            {currentTrack && (
              <p className="text-caption text-muted truncate">
                Tocando: {currentTrack.track.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-xs">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={cn(
              "w-7 h-7 radius-lg flex items-center justify-center text-muted hover:text-primary hover:bg-hover trans-colors",
              shuffle ? "text-primary" : ""
            )}
            aria-label="Aleatório"
            aria-pressed={shuffle}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
            className={cn(
              "w-7 h-7 radius-lg flex items-center justify-center text-muted hover:text-primary hover:bg-hover trans-colors",
              repeat !== 'off' ? "text-primary" : ""
            )}
            aria-label={repeat === 'off' ? 'Repetir desligado' : repeat === 'all' ? 'Repetir tudo' : 'Repetir um'}
            aria-pressed={repeat !== 'off'}
          >
            <Repeat className={cn("w-3.5 h-3.5", repeat === 'one' && 'relative after:content-["1"] after:absolute after:text-[7px] after:top-[-2px] after:right-[-4px]')} />
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={queue.length === 0}
            className="w-7 h-7 radius-lg flex items-center justify-center text-muted hover:text-amber-400 hover:bg-amber-900/30 trans-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Limpar fila (manter faixa atual)"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Clear Queue Confirmation Dialog - outside header flex */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 px-md">
          <div className="bg-elevated border border-subtle radius-lg pad-lg w-full max-w-sm">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-10 h-10 radius-full bg-amber-900/50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="font-medium text-primary">Limpar fila</h4>
            </div>
            <p className="text-muted text-body-sm mb-lg">
              Manter a faixa atual ({currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex].track.title : 'nenhuma'}) e remover as demais?
            </p>
            <div className="flex justify-end gap-sm">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-md py-xs text-body-sm font-medium text-secondary hover:text-primary bg-hover hover:bg-default radius-lg trans-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearQueue}
                className="px-md py-xs text-body-sm font-medium text-primary bg-red-600 hover:bg-red-500 radius-lg trans-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-sm py-sm bg-elevated">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted">
            <ListMusic className="w-10 h-10 mb-md opacity-30" />
            <p className="text-body-sm font-medium text-disabled mb-xs">Fila vazia</p>
            <p className="text-caption text-disabled">Adicione faixas de um álbum ou projeto</p>
          </div>
        ) : (
          <>
            {/* Track count inside playlist area - solid background */}
            <div className="px-sm py-xs text-[11px] text-muted border-b border-subtle bg-elevated mb-xs">
              {queue.length} {queue.length === 1 ? 'faixa' : 'faixas'} na fila
            </div>
            <ul className="space-y-[2px]" role="listbox" aria-label="Fila de reprodução">
            {queue.map((item, index) => {
                const isCurrent = index === currentIndex
                
                return (
                  <li
                    key={`${item.track.id}-${index}`}
                    className={cn(
                      "relative group flex items-center gap-sm px-sm py-xs radius-lg cursor-pointer",
                      isCurrent
                        ? "bg-hover"
                        : "hover:bg-hover"
                    )}
                    onClick={() => playTrack(index)}
                    role="option"
                    aria-selected={isCurrent}
                  >
                    {/* Album cover with play/pause overlay */}
                    <div className="relative w-8 h-8 radius flex-shrink-0 overflow-hidden bg-hover">
                      {item.album.coverPath ? (
                        <img 
                          src={item.album.coverPath.startsWith('data:') ? item.album.coverPath : item.album.coverPath} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Music2 className="w-4 h-4 text-muted mx-auto my-auto" />
                      )}
                      {/* Play/Pause overlay on cover */}
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 trans-colors"
                          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-primary" />
                          ) : (
                            <Play className="w-4 h-4 text-primary ml-[2px]" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Track info - expanded to fill space */}
                    <div className="flex-1 min-w-0 pr-sm">
                      <p className="font-medium text-primary truncate text-body-sm">
                        {index + 1}. {item.track.title}
                      </p>
                      <p className="text-[10px] text-muted flex items-center gap-xs truncate mt-xs">
                        <span className="flex-shrink-0">{item.album.title}</span>
                        <span className="flex items-center gap-xs text-disabled flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {trackDurations[index] || '--:--'}
                        </span>
                      </p>
                    </div>

                    {/* Remove button - floating on the right */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromQueue(index) }}
                      className="absolute right-xs top-1/2 -translate-y-1/2 w-5 h-5 radius flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-900/30 trans-colors opacity-0 group-hover:opacity-100"
                      aria-label="Remover da fila"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                )
              })}
            </ul>
            </>
        )}
      </div>
    </div>
  )
}