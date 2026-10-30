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
    <div className="flex flex-col h-full bg-neutral-900" role="dialog" aria-label="Playlist">
      {/* Header - Solid background */}
      <header className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 bg-neutral-900 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* Close/Hide button on the left */}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            aria-label="Esconder playlist"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-white truncate text-sm">Fila de Reprodução</h3>
            {currentTrack && (
              <p className="text-xs text-neutral-500 truncate">
                Tocando: {currentTrack.track.title}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors",
              shuffle ? "text-white" : ""
            )}
            aria-label="Aleatório"
            aria-pressed={shuffle}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
            className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors",
              repeat !== 'off' ? "text-white" : ""
            )}
            aria-label={repeat === 'off' ? 'Repetir desligado' : repeat === 'all' ? 'Repetir tudo' : 'Repetir um'}
            aria-pressed={repeat !== 'off'}
          >
            <Repeat className={cn("w-3.5 h-3.5", repeat === 'one' && 'relative after:content-["1"] after:absolute after:text-[7px] after:top-[-2px] after:right-[-4px]')} />
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={queue.length === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:bg-amber-900/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Limpar fila (manter faixa atual)"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Clear Queue Confirmation Dialog - outside header flex */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="font-medium text-white">Limpar fila</h4>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Manter a faixa atual ({currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex].track.title : 'nenhuma'}) e remover as demais?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-sm font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearQueue}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 bg-neutral-900">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500">
            <ListMusic className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium text-neutral-400 mb-1">Fila vazia</p>
            <p className="text-xs text-neutral-600">Adicione faixas de um álbum ou projeto</p>
          </div>
        ) : (
          <>
            {/* Track count inside playlist area - solid background */}
            <div className="px-2 py-1.5 text-[11px] text-neutral-500 border-b border-neutral-800 bg-neutral-900 mb-1">
              {queue.length} {queue.length === 1 ? 'faixa' : 'faixas'} na fila
            </div>
            <ul className="space-y-0.5" role="listbox" aria-label="Fila de reprodução">
            {queue.map((item, index) => {
                const isCurrent = index === currentIndex
                
                return (
                  <li
                    key={`${item.track.id}-${index}`}
                    className={cn(
                      "relative group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer",
                      isCurrent
                        ? "bg-neutral-800"
                        : "hover:bg-neutral-800"
                    )}
                    onClick={() => playTrack(index)}
                    role="option"
                    aria-selected={isCurrent}
                  >
                    {/* Album cover with play/pause overlay */}
                    <div className="relative w-8 h-8 rounded flex-shrink-0 overflow-hidden bg-neutral-800">
                      {item.album.coverPath ? (
                        <img 
                          src={item.album.coverPath.startsWith('data:') ? item.album.coverPath : item.album.coverPath} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Music2 className="w-4 h-4 text-neutral-500 mx-auto my-auto" />
                      )}
                      {/* Play/Pause overlay on cover */}
                      {isCurrent && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors"
                          aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Track info - expanded to fill space */}
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-medium text-white truncate text-sm">
                        {index + 1}. {item.track.title}
                      </p>
                      <p className="text-[10px] text-neutral-500 flex items-center gap-1.5 truncate mt-0.5">
                        <span className="flex-shrink-0">{item.album.title}</span>
                        <span className="flex items-center gap-0.5 text-neutral-400 flex-shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {trackDurations[index] || '--:--'}
                        </span>
                      </p>
                    </div>

                    {/* Remove button - floating on the right */}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromQueue(index) }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
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