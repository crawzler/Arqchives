import { useCallback, useEffect, useRef, useState } from 'react'

// Extende Window para incluir electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

// ── Hook para verificar se está rodando no Electron ────────────────────────────
export function useIsElectron(): boolean {
  const [isElectron, setIsElectron] = useState(false)
  useEffect(() => {
    setIsElectron(!!window.electronAPI)
  }, [])
  return isElectron
}

// ── Hook para operações de arquivo ─────────────────────────────────────────────
export function useFileOperations() {
  const api = useRef(window.electronAPI)

  const selectFolder = useCallback(async () => {
    return api.current?.selectFolder() ?? null
  }, [])

  const selectDestFolder = useCallback(async () => {
    return api.current?.selectDestFolder() ?? null
  }, [])

  const selectFiles = useCallback(async (opts?: Parameters<ElectronAPI['selectFiles']>[0]) => {
    return api.current?.selectFiles(opts) ?? null
  }, [])

  const listFiles = useCallback(async (folderPath: string) => {
    return api.current?.listFiles(folderPath) ?? []
  }, [])

  const listFilesRecursive = useCallback(async (folderPath: string) => {
    return api.current?.listFilesRecursive(folderPath) ?? []
  }, [])

  const fileExists = useCallback(async (filePath: string) => {
    return api.current?.fileExists(filePath) ?? false
  }, [])

  const openFile = useCallback(async (filePath: string) => {
    await api.current?.openFile(filePath)
  }, [])

  const revealFile = useCallback(async (filePath: string) => {
    await api.current?.revealFile(filePath)
  }, [])

  const renameFile = useCallback(async (oldPath: string, newName: string) => {
    return api.current?.renameFile(oldPath, newName) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const deleteFile = useCallback(async (filePath: string) => {
    return api.current?.deleteFile(filePath) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const moveFile = useCallback(async (filePath: string, destFolder: string) => {
    return api.current?.moveFile(filePath, destFolder) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const copyFile = useCallback(async (filePath: string, destFolder: string) => {
    return api.current?.copyFile(filePath, destFolder) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const createFolder = useCallback(async (parentPath: string, folderName: string) => {
    return api.current?.createFolder(parentPath, folderName) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const ensureFolder = useCallback(async (dirPath: string) => {
    return api.current?.ensureFolder(dirPath) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const moveOrCopyFile = useCallback(async (opts: Parameters<ElectronAPI['moveOrCopyFile']>[0]) => {
    return api.current?.moveOrCopyFile(opts) ?? { ok: false, error: 'API não disponível' }
  }, [])

  const getLocalUrl = useCallback(async (filePath: string) => {
    return api.current?.getLocalUrl(filePath) ?? null
  }, [])

  const dragOutFile = useCallback((filePath: string) => {
    api.current?.dragOutFile(filePath)
  }, [])

  const getRecommendedAppPath = useCallback(async () => {
    return api.current?.getRecommendedAppPath() ?? ''
  }, [])

  const setAppRootPath = useCallback(async (path: string) => {
    return api.current?.setAppRootPath(path) ?? false
  }, [])

  return {
    selectFolder,
    selectDestFolder,
    selectFiles,
    listFiles,
    listFilesRecursive,
    fileExists,
    openFile,
    revealFile,
    renameFile,
    deleteFile,
    moveFile,
    copyFile,
    createFolder,
    ensureFolder,
    moveOrCopyFile,
    getLocalUrl,
    dragOutFile,
    getRecommendedAppPath,
    setAppRootPath,
  }
}

// ── Hook para store persistence ────────────────────────────────────────────────
export function useStorePersistence() {
  const api = useRef(window.electronAPI)

  const read = useCallback(async (fileName: string) => {
    return api.current?.storeRead(fileName) ?? null
  }, [])

  const write = useCallback(async (fileName: string, data: string) => {
    return api.current?.storeWrite(fileName, data) ?? false
  }, [])

  const getUserDataPath = useCallback(async () => {
    return api.current?.getUserDataPath() ?? ''
  }, [])

  return { read, write, getUserDataPath }
}

// ── Hook para controles de janela ──────────────────────────────────────────────
export function useWindowControls() {
  const minimize = useCallback(() => window.electronAPI?.minimize(), [])
  const maximize = useCallback(() => window.electronAPI?.maximize(), [])
  const close = useCallback(() => window.electronAPI?.close(), [])
  return { minimize, maximize, close }
}

// ── Hook para drag & drop externo ──────────────────────────────────────────────
export function useExternalDrop(onDrop: (paths: string[]) => void) {
  useEffect(() => {
    const cleanup = window.electronAPI?.onElectronDropFiles(onDrop)
    return cleanup
  }, [onDrop])
}

// ── Hook para drop nativo (HTML5) ──────────────────────────────────────────────
export function useNativeDrop(
  onDrop: (files: File[]) => void,
  options: { accept?: string[]; multiple?: boolean } = {}
) {
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { accept = [], multiple = true } = options

  useEffect(() => {
    const el = dropZoneRef.current
    if (!el) return

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!el.contains(e.relatedTarget as Node)) {
        setIsDragging(false)
      }
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer.dropEffect = 'copy'
      setIsDragging(true)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const filteredFiles = accept.length
        ? files.filter(f => accept.some(ext => f.name.toLowerCase().endsWith(ext)))
        : files

      if (!multiple && filteredFiles.length > 1) {
        onDrop([filteredFiles[0]])
      } else {
        onDrop(filteredFiles)
      }
    }

    el.addEventListener('dragenter', handleDragEnter as any)
    el.addEventListener('dragleave', handleDragLeave as any)
    el.addEventListener('dragover', handleDragOver as any)
    el.addEventListener('drop', handleDrop as any)

    return () => {
      el.removeEventListener('dragenter', handleDragEnter as any)
      el.removeEventListener('dragleave', handleDragLeave as any)
      el.removeEventListener('dragover', handleDragOver as any)
      el.removeEventListener('drop', handleDrop as any)
    }
  }, [accept, multiple, onDrop])

  return { ref: dropZoneRef, isDragging }
}

// ── AUDIO_EXTS para uso em componentes ─────────────────────────────────────────
export const AUDIO_EXTS = ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma']
export const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff']
export const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv']