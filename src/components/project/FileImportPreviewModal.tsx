'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileText, FolderOpen, Image as ImageIcon, LoaderCircle, Video, X } from 'lucide-react'
import { useFileOperations } from '@/hooks/useElectron'
import { Button } from '@/components/ui/Button'
import type { Tag } from '@/types'
import type { FileDestinationOption } from './FileDestinationPicker'
import { getMatchingFileTags, resolveFileDestination } from './FileDestinationPicker'

export interface SelectedImportFile {
  path: string
  name: string
  extension: string
}

interface ImportPreviewRow extends SelectedImportFile {
  destinationId: string
  matchedTagLabels: string[]
}

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'])
const videoExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv'])

function getFileName(filePath: string) {
  return filePath.split(/[\\/]/).pop() || filePath
}

function getExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : ''
}

export function FileImportPreviewModal({
  files,
  destinations,
  tags,
  onImport,
  onClose,
}: {
  files: string[]
  destinations: FileDestinationOption[]
  tags: Tag[]
  onImport: (files: Array<SelectedImportFile & { destination: FileDestinationOption }>) => Promise<void>
  onClose: () => void
}) {
  const [rows, setRows] = useState<ImportPreviewRow[]>([])
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    setRows(files.map(path => {
      const name = getFileName(path)
      const extension = getExtension(name)
      const decision = resolveFileDestination(path, destinations, tags)
      const suggestedDestinationId = 'destination' in decision
        ? decision.destination.id
        : decision.reason === 'multiple' ? decision.choices[0]?.id || '' : ''
      return {
        path,
        name,
        extension,
        destinationId: suggestedDestinationId,
        matchedTagLabels: getMatchingFileTags(path, tags).map(tag => tag.label),
      }
    }))
  }, [files, destinations, tags])

  const canImport = useMemo(
    () => rows.length > 0 && rows.every(row => destinations.some(destination => destination.id === row.destinationId)),
    [destinations, rows]
  )

  const updateDestination = (path: string, destinationId: string) => {
    setRows(current => current.map(row => row.path === path ? { ...row, destinationId } : row))
  }

  const handleImport = async () => {
    const preparedFiles = rows.flatMap(row => {
      const destination = destinations.find(option => option.id === row.destinationId)
      return destination ? [{ path: row.path, name: row.name, extension: row.extension, destination }] : []
    })
    if (preparedFiles.length !== rows.length) return

    setImporting(true)
    try {
      await onImport(preparedFiles)
    } catch (error) {
      window.alert(`Não foi possível importar os arquivos: ${String(error)}`)
    } finally {
      setImporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={importing ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-import-preview-title"
        className="w-full max-w-5xl max-h-[90vh] flex flex-col bg-elevated border border-default rounded-xl shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-subtle">
          <div>
            <h2 id="file-import-preview-title" className="text-heading-sm font-semibold">Revisar arquivos</h2>
            <p className="text-caption text-muted mt-1">
              Confira as imagens e vídeos e escolha onde cada arquivo será copiado.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="w-8 h-8 rounded-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary"
            aria-label="Cancelar importação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 md:p-5 overflow-y-auto flex-1">
          <div className="space-y-2">
            {rows.map(row => (
              <ImportPreviewRowItem
                key={row.path}
                row={row}
                destinations={destinations}
                onDestinationChange={destinationId => updateDestination(row.path, destinationId)}
              />
            ))}
          </div>
          {destinations.length === 0 && (
            <p className="mt-4 p-3 rounded-lg bg-amber-500/10 text-amber-200 text-sm">
              Não há pastas de destino configuradas. Configure as pastas antes de importar arquivos.
            </p>
          )}
        </div>

        <div className="flex justify-between items-center gap-3 p-5 border-t border-subtle">
          <p className="text-caption text-muted">{rows.length} arquivo{rows.length === 1 ? '' : 's'} selecionado{rows.length === 1 ? '' : 's'}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} disabled={importing}>Cancelar</Button>
            <Button onClick={handleImport} disabled={!canImport || importing} className="gap-2">
              {importing && <LoaderCircle className="w-4 h-4 animate-spin" />}
              {importing ? 'Copiando...' : 'Confirmar importação'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImportPreviewRowItem({
  row,
  destinations,
  onDestinationChange,
}: {
  row: ImportPreviewRow
  destinations: FileDestinationOption[]
  onDestinationChange: (destinationId: string) => void
}) {
  const { getLocalUrl } = useFileOperations()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewFailed, setPreviewFailed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isImage = imageExtensions.has(row.extension)
  const isVideo = videoExtensions.has(row.extension)

  useEffect(() => {
    let active = true
    if (!isImage && !isVideo) {
      setPreviewUrl(null)
      return
    }
    setPreviewFailed(false)
    getLocalUrl(row.path).then(url => {
      if (active) setPreviewUrl(url)
    }).catch(error => {
      console.error(`Não foi possível carregar a prévia de "${row.name}":`, error)
    })
    return () => { active = false }
  }, [getLocalUrl, isImage, isVideo, row.name, row.path])

  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen])

  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[128px_minmax(0,1fr)_minmax(190px,240px)] gap-3 items-center p-3 rounded-lg bg-base/60 border border-subtle">
      <button
        type="button"
        onClick={() => previewUrl && !previewFailed && (isImage || isVideo) && setLightboxOpen(true)}
        disabled={!previewUrl || previewFailed || (!isImage && !isVideo)}
        aria-label={`Ampliar prévia de ${row.name}`}
        className="w-24 h-16 md:w-32 md:h-20 rounded-md overflow-hidden bg-neutral-950 border border-white/5 flex items-center justify-center disabled:cursor-default enabled:cursor-zoom-in focus-ring"
      >
        {previewUrl && isImage && !previewFailed ? (
          <img src={previewUrl} alt="" className="w-full h-full object-cover" onError={() => setPreviewFailed(true)} />
        ) : previewUrl && isVideo && !previewFailed ? (
          <video src={previewUrl} className="w-full h-full object-cover pointer-events-none" muted preload="metadata" onError={() => setPreviewFailed(true)} />
        ) : isImage ? (
          <ImageIcon className="w-6 h-6 text-neutral-500" />
        ) : isVideo ? (
          <Video className="w-6 h-6 text-neutral-500" />
        ) : (
          <FileText className="w-6 h-6 text-neutral-500" />
        )}
      </button>

      <div className="min-w-0">
        <p className="text-body-sm text-primary truncate" title={row.name}>{row.name}</p>
        <p className="text-caption text-muted">{row.extension ? row.extension.slice(1).toUpperCase() : 'Arquivo sem extensão'}</p>
        <p className="text-caption text-muted truncate" title={row.matchedTagLabels.join(', ')}>
          {row.matchedTagLabels.length > 0 ? `Tags: ${row.matchedTagLabels.join(', ')}` : 'Sem tag correspondente'}
        </p>
      </div>

      <label className="col-start-2 md:col-start-auto min-w-0">
        <span className="sr-only">Pasta de destino para {row.name}</span>
        <span className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-secondary flex-shrink-0" />
          <select
            value={row.destinationId}
            onChange={event => onDestinationChange(event.target.value)}
            className="w-full min-w-0 bg-hover border border-default rounded-lg px-3 py-2 text-body-sm text-primary focus-ring"
          >
            <option value="">Escolher pasta...</option>
            {destinations.map(destination => (
              <option key={destination.id} value={destination.id}>{destination.label}</option>
            ))}
          </select>
        </span>
      </label>

      {lightboxOpen && previewUrl && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Prévia ampliada de ${row.name}`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center focus-ring"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fechar prévia"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center gap-3 max-w-full max-h-full" onClick={event => event.stopPropagation()}>
            {isImage ? (
              <img src={previewUrl} alt={row.name} className="max-w-[92vw] max-h-[82vh] object-contain" />
            ) : (
              <video src={previewUrl} className="max-w-[92vw] max-h-[82vh]" controls autoPlay />
            )}
            <p className="max-w-[92vw] text-sm text-white/80 truncate" title={row.name}>{row.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}
