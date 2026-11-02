import { useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useFileOperations } from './useElectron'
import { sanitizeFileName, generateId } from '@/lib/utils'
import type { AlbumPaths, ProjectPaths, AudioVersion, Tag } from '@/types'

// ── Hook para geração de paths ─────────────────────────────────────────────────
export function usePathGenerator() {
  const { appRoot, projectConfig } = useAppStore()

  const formatTrackNumber = useCallback((number: string | number) => {
    const num = typeof number === 'string' ? parseInt(number, 10) : number
    if (isNaN(num) || !num) return ''
    const format = projectConfig.naming.trackNumberFormat
    if (format === '02d') return String(num).padStart(2, '0')
    if (format === '03d') return String(num).padStart(3, '0')
    return String(num)
  }, [projectConfig.naming.trackNumberFormat])

  const sanitize = useCallback((name: string) => {
    if (!projectConfig.naming.sanitizeNames) return name
    return sanitizeFileName(name)
  }, [projectConfig.naming.sanitizeNames])

  const generateProjectPaths = useCallback((projectName: string): ProjectPaths | null => {
    if (!appRoot) return null
    const sanitizedProject = sanitize(projectName)
    const projectPath = [appRoot, sanitizedProject].join('\\')
    const subfolders: Record<string, string> = {}
    for (const name of projectConfig.folderStructure.projectSubfolders || []) {
      subfolders[name] = `${projectPath}\\${name}`
    }
    return { projectPath, subfolders }
  }, [appRoot, projectConfig.folderStructure.projectSubfolders, sanitize])

  const generateAlbumPath = useCallback((albumTitle: string, projectName: string): string | null => {
    if (!appRoot) return null
    const sanitizedAlbum = sanitize(albumTitle)
    const sanitizedProject = sanitize(projectName)
    return [appRoot, sanitizedProject, 'albums', sanitizedAlbum].join('\\')
  }, [appRoot, sanitize])

  const generateTrackPath = useCallback((
    trackTitle: string,
    trackNumber: string | number,
    albumTitle: string,
    projectName: string
  ): string | null => {
    if (!appRoot) return null

    const template = projectConfig.folderStructure.trackTemplate
    const sanitizedTrack = sanitize(trackTitle)
    const sanitizedAlbum = sanitize(albumTitle)
    const sanitizedProject = sanitize(projectName)
    const formattedNumber = formatTrackNumber(trackNumber)

    let trackFolder = template
      .replace('{trackTitle}', sanitizedTrack)
      .replace('{trackNumber}', formattedNumber)
      .replace('{albumTitle}', sanitizedAlbum)
      .replace('{projectName}', sanitizedProject)

    if (!trackNumber || formattedNumber === '') {
      trackFolder = trackFolder.replace(/^\s*[-_]\s*/, '').trim()
    }

    return [appRoot, sanitizedProject, 'albums', sanitizedAlbum, trackFolder].join('\\')
  }, [appRoot, projectConfig.folderStructure.trackTemplate, sanitize, formatTrackNumber])

  const generateAlbumPaths = useCallback((
    projectName: string,
    albumTitle: string,
    trackTitle?: string,
    trackNumber?: string | number,
    albumType?: 'Álbum' | 'EP' | 'Single' | 'Compilação'
  ): AlbumPaths => {
    const albumPath = generateAlbumPath(albumTitle, projectName) || ''
    
    // Para Single, usa a estrutura de track direto na pasta do álbum
    const isSingle = albumType === 'Single'
    const subfoldersToUse = isSingle ? projectConfig.folderStructure.trackSubfolders : projectConfig.folderStructure.albumSubfolders
    
    const albumSubfolders: Record<string, string> = {}
    for (const subfolder of subfoldersToUse) {
      albumSubfolders[subfolder] = `${albumPath}\\${subfolder}`
    }

    let trackPath: string | undefined
    let trackSubfolders: Record<string, string> | undefined

    if (trackTitle) {
      trackPath = generateTrackPath(trackTitle, trackNumber || 0, albumTitle, projectName) || undefined
      if (trackPath) {
        trackSubfolders = {}
        for (const subfolder of projectConfig.folderStructure.trackSubfolders) {
          trackSubfolders[subfolder] = `${trackPath}\\${subfolder}`
        }
      }
    }

    return { albumPath, albumSubfolders, trackPath, trackSubfolders }
  }, [generateAlbumPath, generateTrackPath, projectConfig.folderStructure])

  const getTagsForFile = useCallback((filePath: string): Tag[] => {
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
    return projectConfig.tags.filter(tag => tag.extensions.includes(ext))
  }, [projectConfig.tags])

  // Retorna a melhor pasta para o arquivo baseado nas tags permitidas
  const getBestDestinationForFile = useCallback((
    filePath: string,
    paths: AlbumPaths
  ): string | null => {
    const fileTags = getTagsForFile(filePath)
    if (fileTags.length === 0) {
      // Fallback: if no tags match, use track folder for audio files
      const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
      const audioExts = ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma']
      if (audioExts.includes(ext)) {
        // Find first track subfolder that supports audio
        if (paths.trackSubfolders) {
          const trackAudioFolder = Object.entries(paths.trackSubfolders).find(([name]) => 
            projectConfig.folderTagConfig.trackFolders[name]?.includes('audio')
          )
          if (trackAudioFolder) return trackAudioFolder[1]
        }
        // Fallback to album subfolder that supports audio
        if (paths.albumSubfolders) {
          const albumAudioFolder = Object.entries(paths.albumSubfolders).find(([name]) =>
            projectConfig.folderTagConfig.albumFolders[name]?.includes('audio')
          )
          if (albumAudioFolder) return albumAudioFolder[1]
        }
        // Ultimate fallback: use track folder or album folder directly
        if (paths.trackPath) return paths.trackPath
        if (paths.albumPath) return paths.albumPath
      }
      return null
    }

    // Função auxiliar para checar se uma pasta suporta as tags do arquivo
    const checkFolderSupport = (folderName: string, config: Record<string, string[]>): boolean => {
      const allowedTags = config[folderName]
      if (!allowedTags) return false
      return fileTags.some(tag => allowedTags.includes(tag.id))
    }

    // 1. Prioriza subpastas da track
    if (paths.trackSubfolders) {
      for (const [folderName, folderPath] of Object.entries(paths.trackSubfolders)) {
        if (checkFolderSupport(folderName, projectConfig.folderTagConfig.trackFolders)) {
          return folderPath
        }
      }
    }

    // 2. Verifica album subfolders
    for (const [folderName, folderPath] of Object.entries(paths.albumSubfolders)) {
      if (checkFolderSupport(folderName, projectConfig.folderTagConfig.albumFolders)) {
        return folderPath
      }
    }

    return null
  }, [getTagsForFile, projectConfig.folderTagConfig])

  return {
    formatTrackNumber,
    sanitize,
    generateProjectPaths,
    generateAlbumPath,
    generateTrackPath,
    generateAlbumPaths,
    getTagsForFile,
    getBestDestinationForFile,
  }
}

// ── Hook para operações de arquivo integradas ──────────────────────────────────
export function useFileOrganizer() {
  const { moveOrCopyFile, ensureFolder } = useFileOperations()
  const { generateAlbumPaths, getBestDestinationForFile, generateProjectPaths } = usePathGenerator()
  const { projectConfig } = useAppStore()

  const createFolderStructure = useCallback(async (paths: AlbumPaths) => {
    const foldersToCreate: string[] = []

    if (paths.albumPath) foldersToCreate.push(paths.albumPath)
    foldersToCreate.push(...Object.values(paths.albumSubfolders))

    if (paths.trackPath) foldersToCreate.push(paths.trackPath)
    if (paths.trackSubfolders) foldersToCreate.push(...Object.values(paths.trackSubfolders))

    for (const folder of foldersToCreate) {
      await ensureFolder(folder)
    }
  }, [ensureFolder])

  const createProjectFolders = useCallback(async (appRoot: string, projectName: string) => {
    const projectPaths = {
      projectPath: [appRoot, projectName].join('\\'),
      subfolders: {} as Record<string, string>
    }
    
    await ensureFolder(projectPaths.projectPath)
    await ensureFolder(projectPaths.projectPath + '\\albums')

    for (const folder of projectConfig.folderStructure.projectSubfolders) {
      const path = `${projectPaths.projectPath}\\${folder}`
      projectPaths.subfolders[folder] = path
      await ensureFolder(path)
    }
    return projectPaths
  }, [projectConfig.folderStructure.projectSubfolders, ensureFolder])

  const organizeFile = useCallback(async (
    filePath: string,
    projectName: string,
    albumTitle: string,
    trackTitle?: string,
    trackNumber?: string | number,
    overrideMode?: 'move' | 'copy'
  ) => {
    const paths = generateAlbumPaths(projectName, albumTitle, trackTitle, trackNumber)
    const destFolder = getBestDestinationForFile(filePath, paths)

    if (!destFolder) {
      return filePath
    }

    await ensureFolder(destFolder)
    // Default to 'copy' for imports, use config mode for internal moves
    const mode = overrideMode ?? 'copy'
    const result = await moveOrCopyFile({
      srcPath: filePath,
      destFolder,
      mode,
    })

    return result.ok ? result.newPath! : filePath
  }, [projectConfig.fileHandling.mode, generateAlbumPaths, getBestDestinationForFile, ensureFolder, moveOrCopyFile])

  // Organiza arquivo no nível do projeto (ex: foto do projeto)
  const organizeProjectFile = useCallback(async (
    filePath: string,
    projectName: string,
    overrideMode?: 'move' | 'copy',
    customFileName?: string // Optional custom filename (e.g., "Cover - Project Name")
  ) => {
    const projectPaths = generateProjectPaths(projectName)
    if (!projectPaths) return filePath

    // Para imagens, procura pasta Artwork no nível do projeto
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase()
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.psd', '.ai']
    
    let destFolder: string | null = null
    
    if (imageExts.includes(ext)) {
      // Procura pasta Artwork nas projectSubfolders
      if (projectPaths.subfolders['Artwork']) {
        destFolder = projectPaths.subfolders['Artwork']
      }
    }
    
    // Fallback: primeira pasta que aceite 'imagens' ou 'todos'
    if (!destFolder) {
      for (const [folderName, folderPath] of Object.entries(projectPaths.subfolders)) {
        const allowedTags = projectConfig.folderTagConfig.projectFolders[folderName]
        if (allowedTags?.includes('imagens') || allowedTags?.includes('todos')) {
          destFolder = folderPath
          break
        }
      }
    }
    
    // Fallback final: pasta raiz do projeto
    if (!destFolder) {
      destFolder = projectPaths.projectPath
    }

    await ensureFolder(destFolder)
    const mode = overrideMode ?? 'copy'
    
    // Use custom filename if provided (for project covers: "Cover - Project Name")
    const fileName = customFileName ? `${customFileName}${ext}` : undefined
    
    const result = await moveOrCopyFile({
      srcPath: filePath,
      destFolder,
      fileName,
      mode,
    })

    return result.ok ? result.newPath! : filePath
  }, [projectConfig.folderTagConfig.projectFolders, projectConfig.fileHandling.mode, generateProjectPaths, ensureFolder, moveOrCopyFile])

  return {
    createFolderStructure,
    createProjectFolders,
    organizeFile,
    organizeProjectFile,
  }
}

// ── Hook para operações de álbum/track ─────────────────────────────────────────
export function useAlbumOperations() {
  const store = useAppStore()
  const { organizeFile, createFolderStructure } = useFileOrganizer()
  const { generateAlbumPaths } = usePathGenerator()

  const addAlbum = useCallback(async (data: any) => {
    if (!store.activeProjectId) return null
    const album = store.addAlbum(store.activeProjectId, data)
    if (album && store.appRoot) {
      const project = store.projects.find(p => p.id === store.activeProjectId)
      if (project) {
        const paths = generateAlbumPaths(project.name, album.title, undefined, undefined, album.type)
        await createFolderStructure(paths)
        
        // If coverFilePath is provided, organize it into the album's Artwork folder
        if (data.coverFilePath) {
          const organizedCoverPath = await organizeFile(data.coverFilePath, project.name, album.title)
          // Update album with the organized cover path
          store.updateAlbum(store.activeProjectId!, album.id, { coverPath: organizedCoverPath })
        }
      }
    }
    return album
  }, [store, generateAlbumPaths, createFolderStructure, organizeFile])

  const addTrack = useCallback(async (albumId: string, data: any) => {
    if (!store.activeProjectId) return null
    const project = store.projects.find(p => p.id === store.activeProjectId)
    const album = store.albums[store.activeProjectId]?.find(a => a.id === albumId)
    if (!project || !album) return null

    let finalAudioPath = data.audioPath
    if (data.audioPath && store.appRoot) {
      finalAudioPath = await organizeFile(data.audioPath, project.name, album.title, data.title, data.number)
    }

    return store.addTrack(store.activeProjectId!, albumId, {
      ...data,
      audioVersions: finalAudioPath ? [{ id: generateId(), label: 'Rascunho', type: 'draft', path: finalAudioPath, createdAt: Date.now() }] : [],
    })
  }, [store, organizeFile])

  return {
    addAlbum,
    addTrack,
    generateAlbumPaths,
    organizeFile,
    createFolderStructure,
  }
}

export { useFileOperations, useWindowControls, useExternalDrop } from './useElectron'