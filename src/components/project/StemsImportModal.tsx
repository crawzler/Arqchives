'use client'

import { useMemo, useState } from 'react'
import { Archive, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatFileSize } from '@/lib/utils'
import type { FileDestinationOption } from './FileDestinationPicker'

export interface StemArchiveFile {
  zipPath: string
  zipName: string
  entryName: string
  name: string
  size: number
}

export interface StemImportSelection extends StemArchiveFile {
  destinationId: string
}

function suggestStemFolder(fileName: string, destinations: FileDestinationOption[]) {
  const categories = destinations
    .filter(destination => destination.id.startsWith('track:Stems/'))
    .map(destination => ({
      destination,
      category: destination.id.slice('track:Stems/'.length).toLowerCase(),
    }))
  const normalized = fileName
    .replace(/^\s*\d+\s*[-_.\s]*/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  const rules: Record<string, RegExp> = {
    vox: /\b(vox|vocal|vocals|voice|voices|choir|harmony|harmonies|adlibs?|bgv|bvox|bv)\b/,
    drums: /\b(drums?|drum kit|kick|snare|hi hats?|hats?|cymbals?|percussion|perc)\b/,
    bass: /\b(bass|sub|808s?)\b/,
    guitars: /\b(guitars?|gtr|gtrs|acoustic|electric guitar)\b/,
    atmos: /\b(atmos|ambient|ambience|synths?|keys|keyboards?|piano|pads?|textures?|sound effects|sfx)\b/,
  }
  const matchedCategory = Object.entries(rules).find(([, rule]) => rule.test(normalized))?.[0]
  return categories.find(({ category }) => category === matchedCategory)?.destination.id
    || categories.find(({ category }) => category === 'more')?.destination.id
    || categories[0]?.destination.id
    || destinations.find(destination => destination.id === 'track:Stems')?.id
    || destinations[0]?.id
    || ''
}

export function StemsImportModal({
  files,
  destinations,
  onImport,
  onClose,
}: {
  files: StemArchiveFile[]
  destinations: FileDestinationOption[]
  onImport: (selections: StemImportSelection[]) => Promise<void>
  onClose: () => void
}) {
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<Record<string, string>>(() =>
    Object.fromEntries(files.map((file, index) => [
      `${file.zipPath}:${file.entryName}:${index}`,
      suggestStemFolder(file.name, destinations),
    ]))
  )
  const [importing, setImporting] = useState(false)

  const selectionRows = useMemo(() => files.map((file, index) => ({
    ...file,
    rowId: `${file.zipPath}:${file.entryName}:${index}`,
  })), [files])

  const handleImport = async () => {
    const selections = selectionRows.map(file => ({
      ...file,
      destinationId: selectedDestinationIds[file.rowId] || '',
    }))
    if (selections.some(selection => !selection.destinationId)) return
    setImporting(true)
    try {
      await onImport(selections)
    } catch (error) {
      window.alert(`Não foi possível importar os stems: ${String(error)}`)
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
        aria-labelledby="stems-import-title"
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-elevated border border-default rounded-xl shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-subtle">
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-blue-400" />
            <div>
              <h2 id="stems-import-title" className="text-heading-sm font-semibold">Revisar importação de stems</h2>
              <p className="text-caption text-muted">{files.length} arquivos de áudio encontrados</p>
            </div>
          </div>
          <button onClick={onClose} disabled={importing} className="w-8 h-8 rounded-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <p className="text-body-sm text-secondary mb-4">
            Confira a sugestão de pasta para cada arquivo. A classificação pelo nome pode variar; você pode alterá-la antes de extrair.
          </p>
          <div className="space-y-2">
            {selectionRows.map(file => (
              <div key={file.rowId} className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(190px,240px)] gap-3 items-center p-3 rounded-lg bg-base/60 border border-subtle">
                <div className="min-w-0">
                  <p className="text-body-sm text-primary truncate" title={file.name}>{file.name}</p>
                  <p className="text-caption text-muted truncate" title={file.zipName}>{file.zipName} · {formatFileSize(file.size)}</p>
                </div>
                <select
                  value={selectedDestinationIds[file.rowId] || ''}
                  onChange={event => setSelectedDestinationIds(current => ({ ...current, [file.rowId]: event.target.value }))}
                  className="w-full bg-hover border border-default rounded-lg px-3 py-2 text-body-sm text-primary focus-ring"
                >
                  {destinations.map(destination => (
                    <option key={destination.id} value={destination.id}>{destination.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-5 border-t border-subtle">
          <Button variant="secondary" onClick={onClose} disabled={importing}>Cancelar</Button>
          <Button onClick={handleImport} disabled={importing || files.length === 0 || destinations.length === 0} className="gap-2">
            <Archive className="w-4 h-4" />
            {importing ? 'Importando...' : 'Extrair e organizar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
