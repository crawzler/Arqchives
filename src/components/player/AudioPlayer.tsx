'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Repeat, Music, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePlaylistCurrentTrack, useActiveProject, usePlaylistCurrentIndex, usePlaylistRepeat, usePlaylistShuffle, useSetRepeat, useSetShuffle } from '@/store/useAppStore'
import { Waveform } from '@/components/player/Waveform'

interface AudioPlayerProps {
  src: string
  onEnded?: () => void
  className?: string
  onPlaylistPlay?: (audioPath: string) => void
  /** Controlled by store - the global playback state */
  isPlaying?: boolean
  /** Callback when playback state changes (store setter) */
  onPlayStateChange?: (playing: boolean) => void
}

export function AudioPlayer({ src, onEnded, className, onPlaylistPlay, isPlaying = false, onPlayStateChange }: AudioPlayerProps) {
  const currentTrack = usePlaylistCurrentTrack()
  const activeProject = useActiveProject()
  const currentIndex = usePlaylistCurrentIndex()
  const repeat = usePlaylistRepeat()
  const shuffle = usePlaylistShuffle()
  const setRepeat = useSetRepeat()
  const setShuffle = useSetShuffle()
  const trackInfo = currentTrack?.track
  // Get duration from track metadata if available
  const trackDuration = trackInfo?.duration
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(trackDuration || 0)

  // Sync duration from track metadata if audio hasn't loaded it yet
  useEffect(() => {
    if (trackDuration && duration === 0) {
      setDuration(trackDuration)
    }
  }, [trackDuration, duration])
  const [volume, setVolume] = useState(1)
  const [waveformReady, setWaveformReady] = useState(false)

  // Project accent color for play button styling
  const projectColor = activeProject?.accent || '#3b82f6'

  // Refs for async event handlers to always see current values
  const isPlayingRef = useRef(isPlaying)
  const srcRef = useRef(src)
  const pendingPlayRef = useRef(false)
  const mountedRef = useRef(true)
  // Track current source to prevent canplay from stale tracks
  const currentSrcRef = useRef(src)
  
  // Reset mounted ref on mount
  mountedRef.current = true
  
  isPlayingRef.current = isPlaying
  srcRef.current = src
  currentSrcRef.current = src

  // Format time helper
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /*
  const _normalizeSrc = useCallback((s: string) => s.replace(/%20/g, ' '), [])
  // Normalize src for comparison (handle %20 encoding differences) - FIXED: no double-encoding
  */

  // Dispatch global events for sync with TrackPlayer
  const dispatchGlobalEvent = useCallback((eventName: string, detail: any) => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: { ...detail, audioPath: srcRef.current } }))
  }, [])

  // Listen for playlist play events (from TrackPlayer/PlaylistPanel requesting different track)
  useEffect(() => {
    const handlePlaylistPlay = (e: CustomEvent) => {
      const { audioPath } = e.detail
      if (audioPath && audioPath !== srcRef.current) {
        onPlaylistPlay?.(audioPath)
      }
    }
    
    window.addEventListener('arqchives:playlist-play', handlePlaylistPlay as EventListener)
    return () => window.removeEventListener('arqchives:playlist-play', handlePlaylistPlay as EventListener)
  }, [onPlaylistPlay])

  // Load audio when src changes - NO auto-play here, just load
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // Don't load if src is empty
    if (!src) {
      setCurrentTime(0)
      setDuration(0)
      return
    }
    
    // Reset time/duration when track changes
    setCurrentTime(0)
    setDuration(0)
    // Reset waveform ready state when track changes
    setWaveformReady(false)
    
    audio.src = src
    audio.loop = repeat === 'one'
    audio.load()

    // Update current source ref when src changes
    currentSrcRef.current = src
    
    const handleTimeUpdate = () => {
      if (!mountedRef.current) return
      setCurrentTime(audio.currentTime)
      dispatchGlobalEvent('arqchives:global-timeupdate', { time: audio.currentTime })
    }
    const handleLoadedMetadata = () => {
      if (!mountedRef.current) return
      const dur = audio.duration
      if (isFinite(dur) && dur > 0) {
        setDuration(dur)
        dispatchGlobalEvent('arqchives:global-duration', { duration: dur })
      }
    }
    const handleEnded = () => {
      if (!mountedRef.current) return
      onPlayStateChange?.(false)
      dispatchGlobalEvent('arqchives:global-pause', {})
      dispatchGlobalEvent('arqchives:audio-ended', {})
      onEnded?.()
    }
    const handleError = (_e: Event) => {
      if (!mountedRef.current) return
      onPlayStateChange?.(false)
    }
    const handlePlay = () => {
      if (!mountedRef.current) return
      dispatchGlobalEvent('arqchives:global-play', {})
    }
    const handlePause = () => {
      if (!mountedRef.current) return
      dispatchGlobalEvent('arqchives:global-pause', {})
    }
    const handleWaiting = () => {
      if (!mountedRef.current) return
    }
    const handleStalled = () => {
      if (!mountedRef.current) return
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('stalled', handleStalled)

    return () => {
      mountedRef.current = false
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('stalled', handleStalled)
      // NOTE: Do NOT pause or clear src here - let isPlaying effect control playback
      // This prevents UI interactions (sidebar collapse, etc.) from stopping playback
    }
  }, [src, repeat, onEnded, dispatchGlobalEvent])

  // Sync playback with controlled isPlaying prop (from store) - SINGLE SOURCE OF TRUTH
  // DEPENDS ON `src` AND `waveformReady`: re-run when track changes or waveform ready
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    if (isPlaying) {
      // If waveform not ready yet, wait for it
      if (!waveformReady) {
        pendingPlayRef.current = true
        return
      }
      
      // Track the source at the moment we start playing
      const playSrc = src
      
      // Try to play immediately
      audio.play().catch(_err => {
      })
      
      // Wait for canplay event - but only if the source hasn't changed
      // IMPORTANT: if source changed, we still need to set up the new track's playback
      const handleCanPlay = () => {
        
        // Check if source changed - if so, the new track's isPlaying effect will handle play
        if (currentSrcRef.current !== playSrc) {
          audio.removeEventListener('canplay', handleCanPlay);
          return;
        }
        
        audio.play().catch(_err => {
        })
        // Remove listener after first fire
        audio.removeEventListener('canplay', handleCanPlay)
      }
      audio.addEventListener('canplay', handleCanPlay)
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay)
      }
    } else {
      pendingPlayRef.current = false
      audio.pause()
    }
  }, [isPlaying, src, waveformReady])

  // When waveform becomes ready and we were waiting to play, trigger playback
  useEffect(() => {
    if (waveformReady && pendingPlayRef.current && isPlaying) {
      const audio = audioRef.current
      if (audio) {
        pendingPlayRef.current = false
        audio.play().catch(_err => {
        })
      }
    }
  }, [waveformReady, isPlaying])

  // Pause audio ONLY on true unmount (component removed from DOM), not on re-renders
  useEffect(() => {
    const audio = audioRef.current
    return () => {
      // This runs ONLY when component unmounts (showPlayer becomes false)
      if (audio) {
        audio.pause()
      }
    }
  }, [])

  // Listen for seek/volume from TrackPlayer
  useEffect(() => {
    const handleSeek = (e: CustomEvent) => {
      const { audioPath, time } = e.detail
      if (audioPath === src) {
        const audio = audioRef.current
        if (audio) {
          audio.currentTime = time
        }
      }
    }
    const handleVolume = (e: CustomEvent) => {
      const { audioPath, volume: newVolume } = e.detail
      if (audioPath === src) {
        const audio = audioRef.current
        if (audio) {
          audio.volume = newVolume
          setVolume(newVolume)
        }
      }
    }

    window.addEventListener('arqchives:global-seek', handleSeek as EventListener)
    window.addEventListener('arqchives:global-volume', handleVolume as EventListener)
    
    return () => {
      window.removeEventListener('arqchives:global-seek', handleSeek as EventListener)
      window.removeEventListener('arqchives:global-volume', handleVolume as EventListener)
    }
  }, [src])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement> | number) => {
    const audio = audioRef.current
    if (!audio) return
    const time = typeof e === 'number' ? e : parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
    dispatchGlobalEvent('arqchives:global-seek', { time })
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds))
  }

  const togglePlay = () => {
    onPlayStateChange?.(!isPlaying)
  }

  const setGlobalVolumeFromPlayer = (vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol))
    const audio = audioRef.current
    if (audio) {
      audio.muted = false
      audio.volume = clampedVol
    }
    setVolume(clampedVol)
    window.dispatchEvent(new CustomEvent('arqchives:global-volume', { detail: { audioPath: srcRef.current, volume: clampedVol } }))
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const newVol = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setGlobalVolumeFromPlayer(newVol)
  }

  return (
    <div className={cn("bg-base border-t border-subtle", className)}>
      <audio ref={audioRef} preload="metadata" />

      {/* Top row: Track info + Controls + Volume */}
      <div className="flex items-center justify-between gap-md px-lg py-sm relative">
        {/* Track info - Left */}
        <div className="flex items-center gap-sm min-w-0 flex-1 pr-md">
          {trackInfo && (
            <div className="flex items-center gap-sm min-w-0">
              {currentTrack?.album?.coverPath ? (
                <img
                  src={currentTrack.album.coverPath.startsWith('data:') ? currentTrack.album.coverPath : currentTrack.album.coverPath}
                  alt=""
                  className="w-6 h-6 radius object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 radius bg-hover flex items-center justify-center flex-shrink-0">
                  <Music className="w-3 h-3 text-muted" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-primary truncate text-body-sm flex items-center gap-xs">
                  <span className="text-muted text-caption">{trackInfo.number ? `${trackInfo.number}.` : `${currentIndex + 1}.`}</span>
                  {trackInfo.title}
                </p>
                {currentTrack?.album && (
                  <p className="text-[11px] text-muted truncate flex items-center gap-xs">
                    {currentTrack.album.title}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

          {/* Time display */}
          <div className="flex items-center gap-sm text-[11px] text-muted font-mono min-w-[80px] justify-end">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

        {/* Transport Controls - Centered absolutely */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-sm">
          {/* Skip Back - 15s */}
          <button
            onClick={() => skip(-15)}
            className="w-8 h-8 radius-full text-muted hover:text-primary hover:bg-hover flex items-center justify-center trans-colors focus-ring"
            title="Retroceder 15s"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          {/* Play/Pause - Main button with project color */}
          <button
            onClick={togglePlay}
            className="relative w-10 h-10 radius-full flex items-center justify-center text-black trans-colors shadow-elev-3 focus-ring"
            style={{
              backgroundColor: projectColor,
              boxShadow: `0 0 20px ${projectColor}CC`
            }}
            aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          {/* Skip Forward - 15s */}
          <button
            onClick={() => skip(15)}
            className="w-8 h-8 radius-full text-muted hover:text-primary hover:bg-hover flex items-center justify-center trans-colors focus-ring"
            title="Avançar 15s"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>

        {/* Right Controls: Shuffle + Repeat + Volume */}
        <div className="flex items-center gap-sm flex-shrink-0">
          {/* Shuffle */}
          <button
            onClick={() => setShuffle(!shuffle)}
            className={cn("w-8 h-8 radius-full flex items-center justify-center trans-colors focus-ring", shuffle ? "text-primary" : "text-muted hover:text-primary hover:bg-hover")}
            title={shuffle ? 'Aleatório ativado' : 'Aleatório'}
            aria-pressed={shuffle}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Repeat - 3 states: off, all, one */}
          <button
            onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
            className={cn("w-8 h-8 radius-full flex items-center justify-center trans-colors focus-ring relative", repeat !== 'off' ? "text-primary" : "text-muted hover:text-primary hover:bg-hover")}
            title={repeat === 'off' ? 'Repetir desligado' : repeat === 'all' ? 'Repetir playlist' : 'Repetir faixa'}
            aria-pressed={repeat !== 'off'}
          >
            <Repeat className="w-3.5 h-3.5" />
            {repeat === 'one' && (
              <span className="absolute top-[-2px] right-[-2px] w-5 h-5 flex items-center justify-center text-[9px] font-bold text-white bg-primary rounded-full">
                1
              </span>
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-sm">
            <button
              onClick={() => { const a = audioRef.current; if (a) { a.muted = !a.muted; setVolume(a.muted ? 0 : a.volume || 1) } }}
              className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary trans-colors focus-ring"
              aria-label={volume === 0 ? 'Ativar som' : 'Mutar'}
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div
              className="relative w-24 h-3 bg-hover cursor-pointer overflow-hidden volume-drag-bar"
              onClick={handleVolumeClick}
              onMouseDown={(e) => {
                e.preventDefault()
                const bar = e.currentTarget
                const rect = bar.getBoundingClientRect()
                document.body.style.userSelect = 'none'
                document.body.style.cursor = 'ew-resize'
                const handleDragMove = (moveEvent: MouseEvent) => {
                  const newVol = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width))
                  setGlobalVolumeFromPlayer(newVol)
                }
                const handleDragEnd = () => {
                  document.body.style.userSelect = ''
                  document.body.style.cursor = ''
                  window.removeEventListener('mousemove', handleDragMove)
                  window.removeEventListener('mouseup', handleDragEnd)
                }
                window.addEventListener('mousemove', handleDragMove)
                window.addEventListener('mouseup', handleDragEnd)
              }}
            >
              <div
                className="h-full bg-red-500"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Waveform Timeline */}
      <div className="px-lg pb-sm">
        <Waveform
          audioPath={src}
          currentTime={currentTime}
          duration={duration}
          color={projectColor}
          height={48}
          onSeek={handleSeek}
          isPlaying={isPlaying}
          onReady={() => setWaveformReady(true)}
        />
      </div>
    </div>
  )
}