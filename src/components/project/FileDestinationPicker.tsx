'use client'

import { motion } from 'framer-motion'
import { FolderOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Tag } from '@/types'

export interface FileDestinationOption {
  id: string
  label: string
  path: string
  tagIds: string[]
}

export type FileDestinationDecision =
  | { destination: FileDestinationOption }
  | { choices: FileDestinationOption[]; reason: 'no-match' | 'multiple' }

export function resolveFileDestination(
  filePath: string,
  destinations: FileDestinationOption[],
  tags: Tag[]
): FileDestinationDecision {
  const fileName = filePath.split(/[\\/]/).pop() || ''
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : ''
  const matchingTagIds = new Set(
    tags
      .filter(tag => tag.extensions.some(tagExtension => tagExtension.toLowerCase() === extension))
      .map(tag => tag.id)
  )
  const specificDestinations = destinations.filter(destination =>
    destination.tagIds.some(tagId => matchingTagIds.has(tagId))
  )
  const matchingDestinations = specificDestinations.length > 0
    ? specificDestinations
    : destinations.filter(destination => destination.tagIds.includes('todos'))

  if (matchingDestinations.length === 1) {
    return { destination: matchingDestinations[0] }
  }
  if (matchingDestinations.length > 1) {
    return { choices: matchingDestinations, reason: 'multiple' }
  }
  return { choices: destinations, reason: 'no-match' }
}

export function FileDestinationPicker({
  fileName,
  choices,
  reason,
  onChoose,
  onClose,
}: {
  fileName: string
  choices: FileDestinationOption[]
  reason: 'no-match' | 'multiple'
  onChoose: (destination: FileDestinationOption) => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm pad-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-destination-title"
        className="bg-elevated border border-default radius-xl shadow-elev-5 w-full max-w-md"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-center justify-between pad-lg border-b border-subtle">
          <h2 id="file-destination-title" className="text-heading-sm font-semibold">Escolher pasta de destino</h2>
          <button onClick={onClose} className="w-8 h-8 radius-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary trans-colors" aria-label="Cancelar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pad-lg gap-md">
          <p className="text-body-sm text-secondary">
            {reason === 'multiple'
              ? 'Mais de uma pasta aceita a tag deste arquivo. Escolha onde copiá-lo:'
              : 'Nenhuma pasta está configurada para a extensão deste arquivo. Escolha onde copiá-lo:'}
          </p>
          <p className="text-caption text-muted truncate" title={fileName}>{fileName}</p>
          <div className="max-h-64 overflow-y-auto space-y-xs">
            {choices.map(destination => (
              <button
                key={destination.id}
                onClick={() => onChoose(destination)}
                className="w-full flex items-center gap-md px-md py-sm radius-lg border border-subtle hover:border-muted hover:bg-hover text-left trans-all"
              >
                <FolderOpen className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-body-sm text-primary truncate">{destination.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-xs">
            <Button variant="secondary" onClick={onClose}>Cancelar importação</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
