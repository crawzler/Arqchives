'use client'

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

export function getMatchingFileTags(filePath: string, tags: Tag[]) {
  const fileName = filePath.split(/[\\/]/).pop() || ''
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : ''
  return tags.filter(tag => tag.extensions.some(tagExtension => tagExtension.toLowerCase() === extension))
}

export function resolveFileDestination(
  filePath: string,
  destinations: FileDestinationOption[],
  tags: Tag[]
): FileDestinationDecision {
  const matchingTagIds = new Set(getMatchingFileTags(filePath, tags).map(tag => tag.id))
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
