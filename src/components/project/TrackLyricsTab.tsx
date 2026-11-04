'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ListMusic, Pause, Play, RotateCcw, Save } from 'lucide-react'
import { getActiveLyricIndex, splitLyricsIntoLines } from '@/lib/lyrics'
import { cn } from '@/lib/utils'
import {
  useAddTracksToQueue,
  usePlaylistCurrentTrack,
  usePlaylistIsPlaying,
  useSetIsPlaying,
  useAppStore,
} from '@/store/useAppStore'
import type { LyricSyncEntry, Track } from '@/types'
import { Button } from '@/components/ui/Button'

interface TrackLyricsTabProps {
  track: Track
  album: import('@/types').Album
  project: import('@/types').Project
  projectColor: string
  audioPath: string | null
  onSave: (changes: Partial<Track>) => void
}

export function TrackLyricsTab({
  track,
  album,
  project,
  projectColor,
  audioPath,
  onSave,
}: TrackLyricsTabProps) {
  const [lyrics, setLyrics] = useState(track.lyrics || '')
  const [dirty, setDirty] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncEntries, setSyncEntries] = useState<LyricSyncEntry[]>([])
  const [nextLineIndex, setNextLineIndex] = useState(0)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [heldStartTime, setHeldStartTime] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const spaceDownRef = useRef(false)
  const heldStartTimeRef = useRef<number | null>(null)
  const lyricsListRef = useRef<HTMLOListElement>(null)
  const addTracksToQueue = useAddTracksToQueue()
  const setIsPlaying = useSetIsPlaying()
  const updateTrack = useAppStore(state => state.updateTrack)
  const currentTrack = usePlaylistCurrentTrack()
  const isPlaying = usePlaylistIsPlaying()
  const lines = useMemo(() => splitLyricsIntoLines(lyrics), [lyrics])
  const isCurrentTrack = currentTrack?.track.id === track.id
  const isCurrentAudioTrack = isCurrentTrack
    && currentTrack?.audioVersion?.id === track.audioVersions?.[0]?.id
  const savedEntries = useMemo(
    () => lines.map((text, index) => {
      const entry = track.lyricSync?.[index]
      return entry?.text === text ? entry : { text, startTime: null }
    }),
    [lines, track.lyricSync]
  )
  const activeLineIndex = syncing
    ? nextLineIndex
    : getActiveLyricIndex(savedEntries, currentTime)
  const accentStyle = { '--accent': projectColor } as React.CSSProperties

  useEffect(() => {
    setLyrics(track.lyrics || '')
    setDirty(false)
    setSyncing(false)
    setSyncEntries([])
    setNextLineIndex(0)
  }, [track.id, track.lyrics])

  useEffect(() => {
    const handleTimeUpdate = (event: Event) => {
      const { time, audioPath: playingAudioPath } = (event as CustomEvent<{ time: number; audioPath: string }>).detail
      if (
        currentTrack?.track.id !== track.id
        || playingAudioPath !== audioPath
        || typeof time !== 'number'
      ) return
      setCurrentTime(time)
    }

    window.addEventListener('arqchives:global-timeupdate', handleTimeUpdate)
    return () => window.removeEventListener('arqchives:global-timeupdate', handleTimeUpdate)
  }, [currentTrack?.track.id, track.id, audioPath])

  useEffect(() => {
    if (activeLineIndex < 0) return
    lyricsListRef.current
      ?.querySelector(`[data-line-index="${activeLineIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeLineIndex])

  const playTrack = useCallback(() => {
    const version = track.audioVersions?.[0]
    if (!audioPath || !version) return

    if (isCurrentAudioTrack) {
      setIsPlaying(!isPlaying)
      return
    }

    const item = { track, album, project, audioVersion: version, audioPath }
    addTracksToQueue([item], { replace: true, playImmediately: true })
    window.dispatchEvent(new CustomEvent('arqchives:playlist-play', {
      detail: { audioPath, index: 0, item },
    }))
  }, [track, album, project, audioPath, isCurrentAudioTrack, isPlaying, setIsPlaying, addTracksToQueue])

  const markNextLine = useCallback((startTime: number, endTime: number) => {
    if (!syncing || nextLineIndex >= syncEntries.length) return
    const updatedEntries = syncEntries.map((entry, index) =>
      index === nextLineIndex
        ? { ...entry, startTime, endTime: Math.max(startTime, endTime) }
        : entry
    )
    setSyncEntries(updatedEntries)
    updateTrack(project.id, album.id, track.id, { lyricSync: updatedEntries })

    const nextIndex = nextLineIndex + 1
    setNextLineIndex(nextIndex)
    if (nextIndex >= updatedEntries.length) setSyncing(false)
  }, [syncing, nextLineIndex, syncEntries, updateTrack, project.id, album.id, track.id])

  useEffect(() => {
    if (!syncing) return
    document.documentElement.dataset.lyricsSyncing = 'true'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && (
        target.isContentEditable
        || target.closest('input, textarea, select, [contenteditable="true"]')
      )) return

      event.preventDefault()
      event.stopImmediatePropagation()
      if (event.repeat || spaceDownRef.current) return
      spaceDownRef.current = true
      setSpaceHeld(true)
      window.dispatchEvent(new CustomEvent('arqchives:request-lyrics-sync-time', {
        detail: { trackId: track.id, edge: 'start' },
      }))
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || !spaceDownRef.current) return
      spaceDownRef.current = false
      setSpaceHeld(false)
      event.preventDefault()
      event.stopImmediatePropagation()
      window.dispatchEvent(new CustomEvent('arqchives:request-lyrics-sync-time', {
        detail: { trackId: track.id, edge: 'end' },
      }))
    }
    const handleSyncTime = (event: Event) => {
      const { trackId, edge, time } = (event as CustomEvent<{
        trackId: string
        edge: 'start' | 'end'
        time: number
      }>).detail
      if (trackId !== track.id || !Number.isFinite(time)) return

      if (edge === 'start') {
        heldStartTimeRef.current = time
        setHeldStartTime(time)
      } else {
        const startTime = heldStartTimeRef.current
        if (startTime === null) return
        heldStartTimeRef.current = null
        setHeldStartTime(null)
        markNextLine(startTime, time)
      }
    }
    const handleWindowBlur = () => {
      spaceDownRef.current = false
      heldStartTimeRef.current = null
      setSpaceHeld(false)
      setHeldStartTime(null)
    }

    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)
    window.addEventListener('arqchives:lyrics-sync-time', handleSyncTime)
    window.addEventListener('blur', handleWindowBlur)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('keyup', handleKeyUp, true)
      window.removeEventListener('arqchives:lyrics-sync-time', handleSyncTime)
      window.removeEventListener('blur', handleWindowBlur)
      delete document.documentElement.dataset.lyricsSyncing
      spaceDownRef.current = false
      heldStartTimeRef.current = null
      setSpaceHeld(false)
      setHeldStartTime(null)
    }
  }, [syncing, markNextLine, track.id])

  const handleSave = () => {
    onSave({ lyrics })
    setDirty(false)
  }

  const startSync = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (lines.length === 0 || !audioPath) return
    const freshEntries = lines.map(text => ({ text, startTime: null }))
    setSyncEntries(freshEntries)
    setNextLineIndex(0)
    setSyncing(true)
    if (!isCurrentAudioTrack) {
      setCurrentTime(0)
    }
    event.currentTarget.blur()
    if (!isCurrentAudioTrack || !isPlaying) playTrack()
  }

  const formatTime = (seconds: number | null) => {
    if (seconds === null || !Number.isFinite(seconds)) return '--:--'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const displayedEntries = syncing ? syncEntries : savedEntries
  const markedCount = displayedEntries.filter(entry => entry.startTime !== null).length

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-base font-medium text-neutral-100">
            <ListMusic className="h-4 w-4" style={{ color: projectColor }} />
            Letra e sincronização
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Cada linha não vazia recebe seu próprio tempo na música.
          </p>
        </div>
        <Button onClick={handleSave} disabled={!dirty} style={accentStyle}>
          <Save className="h-4 w-4" />
          <span>Salvar letra</span>
        </Button>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <section className="flex min-h-[420px] flex-col gap-3">
          <div className="flex items-center justify-between">
            <label htmlFor="track-lyrics" className="text-sm font-medium text-neutral-300">
              Letra da música
            </label>
            <span className="text-xs text-neutral-500">{lines.length} linhas</span>
          </div>
          <textarea
            id="track-lyrics"
            value={lyrics}
            onChange={event => {
              setLyrics(event.target.value)
              setDirty(true)
            }}
            placeholder="Cole ou escreva a letra, uma linha por verso..."
            className="min-h-[360px] flex-1 resize-y rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 font-mono text-sm leading-7 text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/10"
            style={{ caretColor: projectColor }}
          />
          {dirty && (
            <p className="text-xs text-amber-400">Salve a letra antes de iniciar a sincronização.</p>
          )}
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 px-4 py-3">
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-neutral-200">Sincronizar linha por linha</h3>
              <p className="mt-1 text-xs text-neutral-500">
                {syncing
                  ? `Linha ${Math.min(nextLineIndex + 1, lines.length)} de ${lines.length} · segure Espaço durante a linha`
                  : `${markedCount} de ${lines.length} linhas marcadas`}
              </p>
            </div>
            <button
              type="button"
              onClick={playTrack}
              disabled={!audioPath}
              aria-label={isCurrentAudioTrack && isPlaying ? 'Pausar música' : 'Reproduzir música'}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: projectColor }}
            >
              {isCurrentAudioTrack && isPlaying
                ? <Pause className="h-4 w-4" />
                : <Play className="h-4 w-4 translate-x-px" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 border-b border-neutral-800 px-4 py-3">
            {syncing ? (
              <>
                <div
                  className={cn(
                    'inline-flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
                    spaceHeld
                      ? 'border-white/30 bg-white/10 text-white'
                      : 'border-neutral-800 bg-black/20 text-neutral-400'
                  )}
                  style={spaceHeld ? { boxShadow: `0 0 24px ${projectColor}35` } : undefined}
                  aria-live="polite"
                >
                  <kbd
                    className="rounded border border-white/10 bg-black/30 px-2 py-1 font-mono text-[11px] text-neutral-300"
                    style={spaceHeld ? { color: projectColor, borderColor: `${projectColor}70` } : undefined}
                  >
                    Espaço
                  </kbd>
                  <span>{spaceHeld ? 'Solte ao fim da linha cantada' : 'Segure do início ao fim da linha'}</span>
                  {heldStartTime !== null && (
                    <span className="font-mono text-xs text-neutral-500">{formatTime(heldStartTime)}</span>
                  )}
                  {spaceHeld && <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: projectColor }} />}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSyncing(false)}>
                  Concluir
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={startSync}
                disabled={!audioPath || lines.length === 0 || dirty}
                style={accentStyle}
              >
                {markedCount > 0 && <RotateCcw className="h-4 w-4" />}
                <span>{markedCount > 0 ? 'Refazer sincronização' : 'Iniciar sincronização'}</span>
              </Button>
            )}
            {!audioPath && (
              <span className="self-center text-xs text-neutral-500">
                Adicione um áudio à track para sincronizar.
              </span>
            )}
          </div>

          <ol ref={lyricsListRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
            {lines.map((line, index) => {
              const entry = displayedEntries[index]
              const isActive = index === activeLineIndex
              return (
                <li
                  key={`${index}-${line}`}
                  data-line-index={index}
                  className={cn(
                    'flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-white/10 text-white' : 'text-neutral-400'
                  )}
                  style={isActive ? { boxShadow: `inset 2px 0 ${projectColor}` } : undefined}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="w-24 flex-shrink-0 pt-0.5 text-right font-mono text-[11px] text-neutral-600">
                    {entry?.endTime !== null && entry?.endTime !== undefined
                      ? `${formatTime(entry.startTime)} – ${formatTime(entry.endTime)}`
                      : formatTime(entry?.startTime ?? null)}
                  </span>
                  <span className="min-w-0 flex-1 leading-relaxed">{line}</span>
                  {entry?.startTime !== null && entry?.startTime !== undefined && (
                    <Check className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-emerald-400" />
                  )}
                </li>
              )
            })}
            {lines.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-neutral-500">
                Adicione uma linha da letra para começar.
              </li>
            )}
          </ol>
        </section>
      </div>
    </div>
  )
}
