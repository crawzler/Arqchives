'use client'

import { useEffect } from 'react'
import { useAppStore, useSidebarCollapsed, usePlaylistCollapsed, useSetSidebarCollapsed, useSetPlaylistCollapsed, useSetShowConfig, usePlaylistIsOpen, useSetPlaylistOpen, useSetIsPlaying, useShowTempFolder, useSetShowTempFolder, usePlaylistRepeat, usePlaylistShuffle } from '@/store/useAppStore'
import { FolderOpen, ListMusic, Settings, Repeat, Shuffle, RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AppToolbar() {
  const sidebarCollapsed = useSidebarCollapsed()
  const playlistCollapsed = usePlaylistCollapsed()
  const isPlaylistOpen = usePlaylistIsOpen()
  const setSidebarCollapsed = useSetSidebarCollapsed()
  const setPlaylistCollapsed = useSetPlaylistCollapsed()
  const setShowConfig = useSetShowConfig()
  const setPlaylistOpen = useSetPlaylistOpen()
  const setIsPlaying = useSetIsPlaying()
  const showTempFolder = useShowTempFolder()
  const setShowTempFolder = useSetShowTempFolder()

  const repeat = usePlaylistRepeat()
  const shuffle = usePlaylistShuffle()

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)
  const togglePlaylist = () => {
    if (isPlaylistOpen) {
      if (playlistCollapsed) {
        setPlaylistCollapsed(false)
      } else {
        setPlaylistOpen(false)
      }
    } else {
      setPlaylistOpen(true)
    }
  }

  // Keyboard shortcuts - use getState() for current values to avoid stale closures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return
      }
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault()
            toggleSidebar()
            break
          case '2':
            e.preventDefault()
            togglePlaylist()
            break
          case ',':
            e.preventDefault()
            setShowConfig(true)
            break
        }
      }
      // Space to play/pause when not in input
      if (e.code === 'Space' && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)) {
          e.preventDefault()
          const currentIsPlaying = useAppStore.getState().isPlaying
          setIsPlaying(!currentIsPlaying)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar, togglePlaylist, setShowConfig, setIsPlaying])

  return (
    <div className="h-7 bg-neutral-950/80 border-b border-neutral-800/50 flex items-center justify-between px-3 select-none relative z-50" style={{ marginRight: 0 }}>
      {/* Left: Panel toggles + Temp folder + Settings */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleSidebar}
          className={cn(
            'h-5 w-5 rounded flex items-center justify-center transition-all',
            'text-neutral-500 hover:text-white hover:bg-white/5',
            sidebarCollapsed && 'text-white/70 bg-white/10'
          )}
          title={sidebarCollapsed ? 'Mostrar pastas (Alt+1)' : 'Ocultar pastas (Alt+1)'}
          aria-label={sidebarCollapsed ? 'Mostrar pastas' : 'Ocultar pastas'}
          aria-pressed={!sidebarCollapsed}
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowTempFolder(!showTempFolder)}
          className={cn(
            'h-5 w-5 rounded flex items-center justify-center transition-all',
            'text-neutral-500 hover:text-white hover:bg-white/5',
            showTempFolder && 'text-white/70 bg-white/10'
          )}
          title={showTempFolder ? 'Ocultar área Temp' : 'Mostrar área Temp'}
          aria-label={showTempFolder ? 'Ocultar área Temp' : 'Mostrar área Temp'}
          aria-pressed={showTempFolder}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowConfig(true)}
          className="h-5 w-5 rounded flex items-center justify-center transition-all text-neutral-500 hover:text-white hover:bg-white/5"
          title="Configurações"
          aria-label="Configurações"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Empty (track info moved to player) */}
      <div className="flex-1" />

      {/* Right: Playlist toggle + Playback status */}
      <div className="flex items-center gap-1">
        <button
          onClick={togglePlaylist}
          className={cn(
            'h-5 w-5 rounded flex items-center justify-center transition-all',
            'text-neutral-500 hover:text-white hover:bg-white/5',
            (isPlaylistOpen && !playlistCollapsed) && 'text-white/70 bg-white/10',
            isPlaylistOpen && playlistCollapsed && 'text-neutral-400'
          )}
          title={isPlaylistOpen 
            ? (playlistCollapsed ? 'Expandir playlist (Alt+2)' : 'Colapsar playlist (Alt+2)') 
            : 'Abrir playlist (Alt+2)'}
          aria-label={isPlaylistOpen 
            ? (playlistCollapsed ? 'Expandir playlist' : 'Colapsar playlist') 
            : 'Abrir playlist'}
          aria-pressed={isPlaylistOpen && !playlistCollapsed}
        >
          <ListMusic className="w-3.5 h-3.5" />
        </button>

        {repeat !== 'off' && (
          <button
            className="h-5 w-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title={`Repetir: ${repeat === 'one' ? 'Uma' : 'Todas'}`}
          >
            <Repeat className={cn("w-3.5 h-3.5", repeat === 'one' && "text-white")} />
          </button>
        )}

        {shuffle && (
          <button
            className="h-5 w-5 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Aleatório ativado"
          >
            <Shuffle className="w-3.5 h-3.5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}