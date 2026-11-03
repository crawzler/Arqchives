'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, Video } from 'lucide-react'
import { useFileOperations } from '@/hooks/useElectron'
import { getFileIcon, isImageFile, isVideoFile } from '@/lib/utils'

export function FilePreviewThumbnail({ path, name }: { path: string; name: string }) {
  const { getLocalUrl } = useFileOperations()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isImage = isImageFile(name)
  const isVideo = isVideoFile(name)

  useEffect(() => {
    let active = true
    if (!isImage && !isVideo) {
      setPreviewUrl(null)
      return
    }

    setPreviewUrl(null)
    setPreviewFailed(false)
    getLocalUrl(path).then(url => {
      if (active) setPreviewUrl(url)
    }).catch(error => {
      console.error(`Não foi possível carregar a prévia de "${name}":`, error)
    })
    return () => { active = false }
  }, [getLocalUrl, isImage, isVideo, name, path])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  const previewAvailable = !!previewUrl && !previewFailed && (isImage || isVideo)
  const thumbnailContent = previewAvailable ? (
    isImage ? (
      <img src={previewUrl} alt="" className="h-full w-full object-cover" onError={() => setPreviewFailed(true)} />
    ) : (
      <>
        <video src={previewUrl} className="h-full w-full object-cover" muted playsInline preload="metadata" onError={() => setPreviewFailed(true)} />
        <span className="absolute inset-0 flex items-center justify-center bg-black/10">
          <Video className="h-7 w-7 text-white drop-shadow" />
        </span>
      </>
    )
  ) : isImage ? (
    <ImageIcon className="h-8 w-8 text-blue-400" />
  ) : isVideo ? (
    <Video className="h-8 w-8 text-purple-400" />
  ) : (
    getFileIcon(name)
  )

  return (
    <>
      <button
        type="button"
        onClick={() => previewAvailable && setLightboxOpen(true)}
        disabled={!previewAvailable}
        aria-label={previewAvailable ? `Ampliar prévia de ${name}` : `Prévia indisponível para ${name}`}
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-neutral-950/70 focus-ring disabled:cursor-default enabled:cursor-zoom-in"
      >
        {thumbnailContent}
      </button>

      {lightboxOpen && previewUrl && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Prévia ampliada de ${name}`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-ring"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar prévia"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="flex max-h-full max-w-full flex-col items-center gap-3" onClick={event => event.stopPropagation()}>
            {isImage ? (
              <img src={previewUrl} alt={name} className="max-h-[82vh] max-w-[92vw] object-contain" />
            ) : (
              <video src={previewUrl} className="max-h-[82vh] max-w-[92vw]" controls autoPlay />
            )}
            <p className="max-w-[92vw] truncate text-sm text-white/80" title={name}>{name}</p>
          </div>
        </div>
      )}
    </>
  )
}
