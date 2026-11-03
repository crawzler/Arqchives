'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface WaveformProps {
  audioPath: string
  currentTime: number
  duration: number
  color?: string
  height?: number
  className?: string
  onSeek?: (time: number) => void
  isPlaying?: boolean
  onReady?: () => void
}

function fileUrlToPath(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'file:') {
      let path = decodeURIComponent(parsed.pathname)
      if (path.startsWith('/') && path[2] === ':') {
        path = path.slice(1)
      }
      return path
    }
    return url
  } catch {
    return url
  }
}

function resolveCanvasColor(color: string): string {
  const rootStyle = getComputedStyle(document.documentElement)
  let resolved = color

  for (let i = 0; i < 10 && resolved.includes('var('); i++) {
    resolved = resolved.replace(
      /var\((--[\w-]+)(?:,\s*([^)]+))?\)/g,
      (_match, variable: string, fallback?: string) =>
        rootStyle.getPropertyValue(variable).trim() || fallback?.trim() || ''
    )
  }

  return resolved
}

export function Waveform({ audioPath, currentTime, duration, color = 'hsl(var(--color-waveform-progress))', height = 80, className, onSeek, isPlaying, onReady }: WaveformProps) {
  // Debug log via IPC
  window.electronAPI?.debugLog('[Waveform] Render', { audioPath: audioPath?.substring(0, 50) })
  console.log('[Waveform] Render, audioPath:', audioPath)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [peaks, setPeaks] = useState<Float32Array | null>(null)
  const [decodedDuration, setDecodedDuration] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const readyCalledRef = useRef(false)
  const pendingSeekRef = useRef<number | null>(null)
  const onReadyRef = useRef(onReady)

  // Keep ref in sync (does NOT trigger effect re-run)
  useEffect(() => {
    onReadyRef.current = onReady
  }, [onReady])

  useEffect(() => {
    console.log('[Waveform] Effect triggered, audioPath:', audioPath, 'canvas:', canvasRef.current)
    window.electronAPI?.debugLog('[Waveform] Effect triggered', { audioPath, hasCanvas: !!canvasRef.current })
    let cancelled = false
    const canvas = canvasRef.current
    if (!audioPath) return
    setPeaks(null)
    setDecodedDuration(0)
    // Wait for canvas to be ready
    if (!canvas) {
      console.log('[Waveform] Canvas not ready, scheduling retry')
      window.electronAPI?.debugLog('[Waveform] Canvas not ready, scheduling retry')
      requestAnimationFrame(() => {
        if (canvasRef.current && !cancelled) generateWaveform()
      })
      return
    }
    setIsGenerating(true)
    readyCalledRef.current = false

    async function generateWaveform() {
      let audioCtx: AudioContext | null = null
      try {
        console.log('[Waveform] Starting generateWaveform for:', audioPath)
        window.electronAPI?.debugLog('[Waveform] Starting generateWaveform', { audioPath })
        const filePath = fileUrlToPath(audioPath)
        console.log('[Waveform] filePath:', filePath)
        window.electronAPI?.debugLog('[Waveform] filePath', { filePath })
        const fileData = await window.electronAPI?.readAudioFile(filePath)
        console.log('[Waveform] Audio data:', fileData ? `${fileData.byteLength} bytes` : 'unavailable')
        window.electronAPI?.debugLog('[Waveform] Audio data received', {
          byteLength: fileData?.byteLength ?? 0,
          isArrayBuffer: fileData instanceof ArrayBuffer,
        })

        if (!fileData) {
          console.error('[Waveform] No audio data returned for', filePath)
          if (!cancelled) setIsGenerating(false)
          if (!readyCalledRef.current && onReadyRef.current) {
            readyCalledRef.current = true
            onReadyRef.current()
          }
          return
        }

        const audioData = fileData instanceof ArrayBuffer
          ? fileData.slice(0)
          : Uint8Array.from(fileData).buffer
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const audioBuffer = await audioCtx.decodeAudioData(audioData)
        console.log('[Waveform] decodeAudioData success, duration:', audioBuffer.duration)
        window.electronAPI?.debugLog('[Waveform] decodeAudioData success', { duration: audioBuffer.duration })

        if (cancelled) return

        if (!cancelled) {
          setDecodedDuration(audioBuffer.duration)
        }

        const channelData = audioBuffer.getChannelData(0)
        const samples = channelData.length
        const c = canvas!
        const canvasWidth = c.offsetWidth * window.devicePixelRatio

        if (canvasWidth === 0) {
          requestAnimationFrame(() => {
            if (!cancelled) generateWaveform()
          })
          return
        }

        c.width = canvasWidth
        c.height = height * window.devicePixelRatio

        const peaksPerPixel = samples / canvasWidth
        const peakData = new Float32Array(canvasWidth)

        for (let i = 0; i < canvasWidth; i++) {
          const start = Math.floor(i * peaksPerPixel)
          const end = Math.floor((i + 1) * peaksPerPixel)
          let min = 1
          let max = -1
          for (let j = start; j < end; j++) {
            const val = channelData[j]
            if (val < min) min = val
            if (val > max) max = val
          }
          peakData[i] = Math.max(Math.abs(min), Math.abs(max))
        }

        if (!cancelled) {
          setPeaks(peakData)
          setIsGenerating(false)
          if (!readyCalledRef.current && onReadyRef.current) {
            readyCalledRef.current = true
            console.log('[Waveform] Calling onReady')
            window.electronAPI?.debugLog('[Waveform] Calling onReady')
            onReadyRef.current()
          }
        }

      } catch (error) {
        console.error('[Waveform] Failed to generate waveform', { audioPath, error })
        if (!cancelled) {
          setIsGenerating(false)
          // Call onReady even on error so playback can proceed
          if (!readyCalledRef.current && onReadyRef.current) {
            readyCalledRef.current = true
            console.log('[Waveform] Calling onReady (error path)')
            window.electronAPI?.debugLog('[Waveform] Calling onReady (error path)', { error: String(error) })
            onReadyRef.current()
          }
        }
      } finally {
        if (audioCtx && audioCtx.state !== 'closed') {
          await audioCtx.close()
        }
      }
    }

    generateWaveform()

    return () => {
      cancelled = true
    }
  }, [audioPath, height])

  useEffect(() => {
    pendingSeekRef.current = null
    readyCalledRef.current = false
  }, [audioPath])

  useEffect(() => {
    if (peaks && pendingSeekRef.current !== null) {
      const percent = pendingSeekRef.current
      pendingSeekRef.current = null
      const effectiveDuration = duration > 0 ? duration : decodedDuration
      if (effectiveDuration > 0 && onSeek) {
        onSeek(percent * effectiveDuration)
      }
    }
  }, [peaks, duration, decodedDuration, onSeek])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return
    const effectiveDuration = duration > 0 ? duration : decodedDuration
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

    if (effectiveDuration === 0 || !peaks) {
      pendingSeekRef.current = percent
      return
    }

    const seekTime = percent * effectiveDuration
    onSeek(seekTime)
  }

  // Drag-to-seek (real-time, like volume bar)
  const handleDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!onSeek) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    const doSeek = (moveEvent: MouseEvent) => {
      const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width))
      const effectiveDuration = duration > 0 ? duration : decodedDuration
      if (effectiveDuration === 0 || !peaks) {
        pendingSeekRef.current = percent
        return
      }
      onSeek(percent * effectiveDuration)
    }

    const doEnd = () => {
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', doSeek)
      window.removeEventListener('mouseup', doEnd)
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'ew-resize'
    window.addEventListener('mousemove', doSeek)
    window.addEventListener('mouseup', doEnd)
  }, [onSeek, duration, decodedDuration, peaks])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !peaks) return

    const ctx = canvas.getContext('2d')!
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    const centerY = canvasHeight / 2
    const effectiveDuration = duration > 0 ? duration : decodedDuration
    const progress = effectiveDuration > 0 ? currentTime / effectiveDuration : 0
    const progressX = progress * canvasWidth

    // Canvas fillStyle does not resolve nested CSS custom properties.
    const trackColor = resolveCanvasColor('hsl(var(--color-waveform-track))')
    const progressColor = resolveCanvasColor(color)

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Track background (unplayed portion) - full width, dark gray
    ctx.fillStyle = trackColor
    drawWaveform(ctx, peaks, canvasWidth, canvasHeight, centerY)

    // Progress portion (played) - only up to progressX, project color
    if (progress > 0 && progress < 1) {
      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, progressX, canvasHeight)
      ctx.clip()
      ctx.fillStyle = progressColor
      drawWaveform(ctx, peaks, canvasWidth, canvasHeight, centerY)
      ctx.restore()
    } else if (progress >= 1) {
      // Finished - full project color
      ctx.fillStyle = progressColor
      drawWaveform(ctx, peaks, canvasWidth, canvasHeight, centerY)
    }

    // Progress line indicator
    if (progress > 0 && progress < 1) {
      ctx.strokeStyle = progressColor
      ctx.lineWidth = 2 * window.devicePixelRatio
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, canvasHeight)
      ctx.stroke()
    }
  }, [peaks, currentTime, duration, decodedDuration, color, height, isPlaying])

  function drawWaveform(
    ctx: CanvasRenderingContext2D,
    peaks: Float32Array,
    width: number,
    height: number,
    centerY: number
  ) {
    const barWidth = Math.max(1, Math.floor(width / peaks.length))
    const maxHeight = height * 0.45

    ctx.beginPath()
    ctx.moveTo(0, centerY)

    for (let i = 0; i < peaks.length; i++) {
      const x = i * barWidth
      const h = peaks[i] * maxHeight
      ctx.lineTo(x, centerY - h)
    }

    for (let i = peaks.length - 1; i >= 0; i--) {
      const x = i * barWidth
      const h = peaks[i] * maxHeight
      ctx.lineTo(x, centerY + h)
    }

    ctx.closePath()
    ctx.fill()
  }

  function drawWaveformProgress(
    ctx: CanvasRenderingContext2D,
    peaks: Float32Array,
    width: number,
    height: number,
    centerY: number,
    progressX: number
  ) {
    const barWidth = Math.max(1, Math.floor(width / peaks.length))
    const maxHeight = height * 0.45
    const lastIndex = Math.min(peaks.length - 1, Math.floor(progressX / barWidth))

    ctx.beginPath()
    ctx.moveTo(0, centerY)

    for (let i = 0; i <= lastIndex; i++) {
      const x = i * barWidth
      const h = peaks[i] * maxHeight
      ctx.lineTo(x, centerY - h)
    }

    const lastX = lastIndex * barWidth
    const lastH = peaks[lastIndex] * maxHeight
    ctx.lineTo(lastX, centerY + lastH)

    for (let i = lastIndex; i >= 0; i--) {
      const x = i * barWidth
      const h = peaks[i] * maxHeight
      ctx.lineTo(x, centerY + h)
    }

    ctx.closePath()
    ctx.fill()
  }

  return (
    <div
      className={cn("relative w-full cursor-pointer focus-ring", className)}
      aria-label="Forma de onda do áudio"
      onClick={handleClick}
      onMouseDown={handleDragStart}
      tabIndex={0}
      onKeyDown={(e) => {
        if (!onSeek) return
        const effectiveDuration = duration > 0 ? duration : decodedDuration
        if (effectiveDuration === 0) return
        
        const currentPercent = effectiveDuration > 0 ? currentTime / effectiveDuration : 0
        let newPercent = currentPercent
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          newPercent = Math.max(0, currentPercent - 0.05) // 5% step
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          newPercent = Math.min(1, currentPercent + 0.05) // 5% step
        } else if (e.key === 'Home') {
          e.preventDefault()
          newPercent = 0
        } else if (e.key === 'End') {
          e.preventDefault()
          newPercent = 1
        } else {
          return
        }
        
        onSeek(newPercent * effectiveDuration)
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height, width: '100%', opacity: isGenerating ? 0.25 : 1 }}
      />

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border-2 border-primary/60 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}