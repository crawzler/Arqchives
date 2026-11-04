import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { shallow } from 'zustand/shallow'
import type { AppState, Project, ProjectConfig, Album, Track, TodoItem, AudioVersion, Tag, FolderTagConfig } from '@/types'
import { DEFAULT_PROJECT_CONFIG, DEFAULT_TAGS, DEFAULT_FOLDER_TAG_CONFIG } from '@/types'
import { generateId, sanitizeFileName } from '@/lib/utils'
import { getPreferredAudioVersion } from '@/lib/playlist'

// ── Playlist Types ───────────────────────────────────────────────────────────────
interface PlaylistTrack {
  track: Track
  album: Album
  project: Project
  audioVersion?: AudioVersion
  audioPath?: string
}

interface PlaylistState {
  queue: PlaylistTrack[]
  currentIndex: number
  isPlaying: boolean
  repeat: 'off' | 'all' | 'one'
  shuffle: boolean
  isOpen: boolean
  addTracksToQueue: (tracks: PlaylistTrack[], options?: { replace?: boolean; playImmediately?: boolean }) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  setCurrentIndex: (index: number) => void
  playNext: () => void
  playPrevious: () => void
  setIsPlaying: (playing: boolean) => void
  setRepeat: (mode: 'off' | 'all' | 'one') => void
  setShuffle: (shuffle: boolean) => void
  reorderQueue: (fromIndex: number, toIndex: number) => void
  setPlaylistOpen: (open: boolean) => void
}

// ── Storage helpers ────────────────────────────────────────────────────────────
const STORAGE_KEY = 'arqchives-store'

const electronStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.storeRead(name)
    }
    return localStorage.getItem(name)
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      await window.electronAPI.storeWrite(name, value)
    } else {
      localStorage.setItem(name, value)
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      await window.electronAPI.storeRemove(name)
    } else {
      localStorage.removeItem(name)
    }
  },
}

// ── Default projects ───────────────────────────────────────────────────────────
const DEFAULT_PROJECTS: Project[] = []

// ── Helpers ────────────────────────────────────────────────────────────────────
function createDefaultAlbum(data: Partial<Album> = {}): Album {
  return {
    id: generateId(),
    title: data.title || 'Novo Álbum',
    type: data.type || 'Álbum',
    year: data.year || new Date().getFullYear(),
    description: data.description || '',
    coverPath: data.coverPath || null,
    files: [],
    todos: [],
    tracks: [],
    social: {
      full: { title: '', description: '', hashtags: '', credits: '' },
      short: { title: '', description: '', hashtags: '', credits: '' },
    },
    createdAt: Date.now(),
    ...data,
  }
}

function createDefaultTrack(data: Partial<Track> = {}): Track {
  return {
    id: generateId(),
    number: data.number || '',
    title: data.title || 'Nova Música',
    bpm: data.bpm || '',
    key: data.key || '',
    status: data.status || 'idea',
    notes: data.notes || '',
    audioVersions: data.audioVersions || [],
    versionMode: data.versionMode || 'single',
    lyrics: data.lyrics || '',
    lyricSync: data.lyricSync || [],
    prompt: data.prompt || '',
    style: data.style || '',
    social: {
      full: { title: '', description: '', hashtags: '', credits: '' },
      short: { title: '', description: '', hashtags: '', credits: '' },
    },
    files: [],
    todos: [],
    createdAt: Date.now(),
    ...data,
  }
}

function createDefaultTodo(text: string): TodoItem {
  return {
    id: generateId(),
    text,
    done: false,
    createdAt: Date.now(),
  }
}

// ── Store ──────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── App Root ─────────────────────────────────────────────────────────────
      appRoot: null,
      setAppRoot: (path: string) => set({ appRoot: path }),
      clearAppRoot: () => set({ appRoot: null }),
      resetApp: async () => {
        // Clear persisted storage
        if (typeof window !== 'undefined' && window.electronAPI) {
          await window.electronAPI.storeRemove('arqchives-store')
        }
        set({
          appRoot: null,
          projects: DEFAULT_PROJECTS,
          activeProjectId: null,
          projectConfig: DEFAULT_PROJECT_CONFIG,
          albums: {},
          // Playlist state
          queue: [],
          currentIndex: -1,
          isPlaying: false,
          repeat: 'off',
          shuffle: false,
          isOpen: false,
          isLoading: false,
        })
      },

      // ── Projects ──────────────────────────────────────────────────────────────
      projects: DEFAULT_PROJECTS,
      activeProjectId: null,
      setActiveProject: (id: string) => set({ activeProjectId: id }),
      addProject: (project) => {
        const PROJECT_ACCENTS = [
          '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#a855f7',
          '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#f43f5e',
          '#6366f1', '#14b8a6'
        ]
        const randomAccent = PROJECT_ACCENTS[Math.floor(Math.random() * PROJECT_ACCENTS.length)]
        const newProject: Project = { 
          ...project, 
          id: generateId(),
          accent: project.accent || randomAccent,
          photo: project.photo || ''
        }
        set((state) => ({ projects: [...state.projects, newProject] }))
        return newProject
      },
      updateProject: (id: string, changes: Partial<Project>) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...changes } : p)),
        })),
      deleteProject: (id: string) =>
        set((state) => {
          const newProjects = state.projects.filter((p) => p.id !== id)
          const newActiveId = state.activeProjectId === id ? newProjects[0]?.id || null : state.activeProjectId
          return { projects: newProjects, activeProjectId: newActiveId }
        }),
      reorderProjects: (projects: Project[]) => set({ projects }),

      // ── Project Config ────────────────────────────────────────────────────────
      projectConfig: DEFAULT_PROJECT_CONFIG,
      updateProjectConfig: (config: Partial<ProjectConfig>) =>
        set((state) => ({
          projectConfig: { ...state.projectConfig, ...config },
        })),
      resetProjectConfig: () => set({ projectConfig: DEFAULT_PROJECT_CONFIG }),

      // ── Tags Management ──────────────────────────────────────────────────────────
      addTag: (tag) => {
        const newTag: Tag = { ...tag, id: generateId() }
        set((state) => ({
          projectConfig: { ...state.projectConfig, tags: [...state.projectConfig.tags, newTag] }
        }))
        return newTag
      },
      updateTag: (id: string, changes: Partial<Tag>) =>
        set((state) => ({
          projectConfig: {
            ...state.projectConfig,
            tags: state.projectConfig.tags.map(t => t.id === id ? { ...t, ...changes } : t),
          },
        })),
      deleteTag: (id: string) =>
        set((state) => ({
          projectConfig: {
            ...state.projectConfig,
            tags: state.projectConfig.tags.filter(t => t.id !== id),
          },
        })),
      reorderTags: (tags: Tag[]) =>
        set((state) => ({
          projectConfig: { ...state.projectConfig, tags },
        })),

      // ── Folder Tag Config Management ────────────────────────────────────────────
      updateFolderTagConfig: (config: Partial<FolderTagConfig>) =>
        set((state) => ({
          projectConfig: {
            ...state.projectConfig,
            folderTagConfig: { ...state.projectConfig.folderTagConfig, ...config },
          },
        })),
      resetFolderTagConfig: () => set((state) => ({
        projectConfig: { ...state.projectConfig, folderTagConfig: DEFAULT_FOLDER_TAG_CONFIG }
      })),

      // ── Albums ────────────────────────────────────────────────────────────────
      albums: {},
      addAlbum: (projectId: string, albumData) => {
        const newAlbum = createDefaultAlbum(albumData)
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: [...(state.albums[projectId] || []), newAlbum],
          },
        }))
        return newAlbum
      },
      updateAlbum: (projectId: string, albumId: string, changes: Partial<Album>) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, ...changes } : a
            ),
          },
        })),
      deleteAlbum: (projectId: string, albumId: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).filter((a) => a.id !== albumId),
          },
        })),
      reorderAlbums: (projectId: string, albums: Album[]) =>
        set((state) => ({
          albums: { ...state.albums, [projectId]: albums },
        })),

      // ── Tracks ────────────────────────────────────────────────────────────────
      addTrack: (projectId: string, albumId: string, trackData) => {
        const newTrack = createDefaultTrack(trackData)
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, tracks: [...a.tracks, newTrack] } : a
            ),
          },
        }))
        return newTrack
      },
      updateTrack: (projectId: string, albumId: string, trackId: string, changes: Partial<Track>) =>
        set((state) => {
          let updatedTrack: Track | undefined
          const albums = {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((track) => {
                      if (track.id !== trackId) return track
                      const lyricSync = changes.lyricSync !== undefined
                        ? changes.lyricSync
                        : changes.lyrics !== undefined && changes.lyrics !== track.lyrics
                          ? []
                          : track.lyricSync
                      updatedTrack = { ...track, ...changes, lyricSync }
                      return updatedTrack
                    }),
                  }
                : a
            ),
          }

          if (!updatedTrack) return { albums }
          const synchronizedTrack = updatedTrack
          return {
            albums,
            queue: state.queue.map((item) =>
              item.track.id === trackId && item.album.id === albumId
                ? { ...item, track: synchronizedTrack }
                : item
            ),
          }
        }),
      deleteTrack: (projectId: string, albumId: string, trackId: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, tracks: a.tracks.filter((t) => t.id !== trackId) } : a
            ),
          },
        })),
      reorderTracks: (projectId: string, albumId: string, tracks: Track[]) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, tracks } : a
            ),
          },
        })),

      // ── Files ──────────────────────────────────────────────────────────────────
      addAlbumFile: (projectId: string, albumId: string, filePath: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId && !a.files.includes(filePath)
                ? { ...a, files: [...a.files, filePath] }
                : a
            ),
          },
        })),
      removeAlbumFile: (projectId: string, albumId: string, filePath: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, files: a.files.filter((f) => f !== filePath) } : a
            ),
          },
        })),
      addTrackFile: (projectId: string, albumId: string, trackId: string, filePath: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((t) =>
                      t.id === trackId && !t.files.includes(filePath)
                        ? { ...t, files: [...t.files, filePath] }
                        : t
                    ),
                  }
                : a
            ),
          },
        })),
      removeTrackFile: (projectId: string, albumId: string, trackId: string, filePath: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((t) =>
                      t.id === trackId ? { ...t, files: t.files.filter((f) => f !== filePath) } : t
                    ),
                  }
                : a
            ),
          },
        })),

      // ── Todos ──────────────────────────────────────────────────────────────────
      addAlbumTodo: (projectId: string, albumId: string, text: string) => {
        const todo = createDefaultTodo(text)
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, todos: [...(a.todos || []), todo] } : a
            ),
          },
        }))
        return todo
      },
      updateAlbumTodo: (projectId: string, albumId: string, todoId: string, changes: Partial<TodoItem>) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? { ...a, todos: (a.todos || []).map((t) => (t.id === todoId ? { ...t, ...changes } : t)) }
                : a
            ),
          },
        })),
      deleteAlbumTodo: (projectId: string, albumId: string, todoId: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, todos: (a.todos || []).filter((t) => t.id !== todoId) } : a
            ),
          },
        })),
      reorderAlbumTodos: (projectId: string, albumId: string, todos: TodoItem[]) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId ? { ...a, todos } : a
            ),
          },
        })),

      addTrackTodo: (projectId: string, albumId: string, trackId: string, text: string) => {
        const todo = createDefaultTodo(text)
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((t) =>
                      t.id === trackId ? { ...t, todos: [...(t.todos || []), todo] } : t
                    ),
                  }
                : a
            ),
          },
        }))
        return todo
      },
      updateTrackTodo: (projectId: string, albumId: string, trackId: string, todoId: string, changes: Partial<TodoItem>) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((t) =>
                      t.id === trackId
                        ? { ...t, todos: (t.todos || []).map((td) => (td.id === todoId ? { ...td, ...changes } : td)) }
                        : t
                    ),
                  }
                : a
            ),
          },
        })),
      deleteTrackTodo: (projectId: string, albumId: string, trackId: string, todoId: string) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? {
                    ...a,
                    tracks: a.tracks.map((t) =>
                      t.id === trackId ? { ...t, todos: (t.todos || []).filter((td) => td.id !== todoId) } : t
                    ),
                  }
                : a
            ),
          },
        })),
      reorderTrackTodos: (projectId: string, albumId: string, trackId: string, todos: TodoItem[]) =>
        set((state) => ({
          albums: {
            ...state.albums,
            [projectId]: (state.albums[projectId] || []).map((a) =>
              a.id === albumId
                ? { ...a, tracks: a.tracks.map((t) => (t.id === trackId ? { ...t, todos } : t)) }
                : a
            ),
          },
        })),

      // ── Scan & Sync ────────────────────────────────────────────────────────────
      scanAndSync: async (projectId: string) => {
        const { appRoot, projectConfig, albums, updateAlbum, addAlbum, addTrack } = get()
        if (!appRoot || !projectConfig || !window.electronAPI) return

        const project = get().projects.find(p => p.id === projectId)
        if (!project) return

        const sanitize = (name: string) => sanitizeFileName(name)
        const projectPath = [appRoot, sanitize(project.name)].join('\\')
        const albumsPath = projectPath + '\\albums'

        const albumSubfolderNames = (projectConfig.folderStructure.albumSubfolders || [])
          .map(s => s.toLowerCase())
        const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
        const audioExts = ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma']

        const albumEntries = await window.electronAPI.listFiles(albumsPath)
        if (!albumEntries?.length) return

        const albumFolders = albumEntries.filter(e => e.isDirectory)

        for (const albumFolder of albumFolders) {
          const albumTitle = albumFolder.name
          const existingAlbum = albums[projectId]?.find(
            a => sanitize(a.title).toLowerCase() === sanitize(albumTitle).toLowerCase()
          )

          // Procura capa
          async function findAlbumCover(albumPath: string): Promise<string | null> {
            const artworkPath = albumPath + '\\artwork'
            const artworkFiles = await window.electronAPI!.listFiles(artworkPath).catch(() => null)
            if (artworkFiles?.length) {
              const img = artworkFiles.find(f => !f.isDirectory && imageExts.includes(f.ext))
              if (img) return img.path
            }
            const albumFiles = await window.electronAPI!.listFiles(albumPath)
            const img = albumFiles?.find(f => !f.isDirectory && imageExts.includes(f.ext))
            return img?.path || null
          }

          let albumId: string
          if (!existingAlbum) {
            const coverPath = await findAlbumCover(albumFolder.path)
            const newAlbum = createDefaultAlbum({ title: albumTitle, coverPath })
            albumId = newAlbum.id
            addAlbum(projectId, newAlbum)
          } else {
            albumId = existingAlbum.id
            if (!existingAlbum.coverPath) {
              const coverPath = await findAlbumCover(albumFolder.path)
              if (coverPath) updateAlbum(projectId, albumId, { coverPath })
            }
          }

          // Lista subpastas do álbum (cada uma pode ser uma track)
          const albumContents = await window.electronAPI.listFiles(albumFolder.path)
          if (!albumContents?.length) continue

          const trackFolders = albumContents.filter(e =>
            e.isDirectory && !albumSubfolderNames.includes(e.name.toLowerCase())
          )

          const currentAlbum = get().albums[projectId]?.find(a => a.id === albumId)

          for (const trackFolder of trackFolders) {
            const match = trackFolder.name.match(/^(\d+)\s*[-–.]\s*(.+)$/)
            const trackNumber = match ? match[1] : ''
            const trackTitle = match ? match[2].trim() : trackFolder.name

            const existingTrack = currentAlbum?.tracks?.find(
              t => sanitize(t.title).toLowerCase() === sanitize(trackTitle).toLowerCase()
            )
            if (existingTrack) continue

            // Procura arquivo de áudio
            const trackContents = await window.electronAPI.listFiles(trackFolder.path)
            let audioPath: string | null = null
            const audioSubfolder = trackContents?.find(e => e.isDirectory && e.name.toLowerCase() === 'audio')
            if (audioSubfolder) {
              const audioFiles = await window.electronAPI.listFiles(audioSubfolder.path)
              const audioFile = audioFiles?.find(f => !f.isDirectory && audioExts.includes(f.ext))
              if (audioFile) audioPath = audioFile.path
            }
            if (!audioPath) {
              const audioFile = trackContents?.find(f => !f.isDirectory && audioExts.includes(f.ext))
              if (audioFile) audioPath = audioFile.path
            }

            const audioVersions: AudioVersion[] = audioPath
              ? [{ id: generateId(), label: 'Rascunho', type: 'draft', path: audioPath, createdAt: Date.now() }]
              : []

            addTrack(projectId, albumId, {
              number: trackNumber,
              title: trackTitle,
              status: 'idea',
              audioVersions,
            })
          }
        }
      },

      // ── UI State ───────────────────────────────────────────────────────────────
      isLoading: false,
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      showConfig: false,
      setShowConfig: (show: boolean) => set({ showConfig: show }),
      showTempFolder: true,
      setShowTempFolder: (show: boolean) => set({ showTempFolder: show }),

      // ── Playlist / Queue ────────────────────────────────────────────────────────
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      repeat: 'off' as 'off' | 'all' | 'one',
      shuffle: false,
      isOpen: false,
      sidebarWidth: 288, // w-72 = 288px
      playlistWidth: 280,
      sidebarCollapsed: false,
      playlistCollapsed: false,
      addTracksToQueue: (tracks: PlaylistTrack[], options?: { replace?: boolean; playImmediately?: boolean }) => {
        const { replace = false, playImmediately } = options || {}
        set((state) => {
          const wasEmpty = state.queue.length === 0
          const newQueue = replace ? tracks : [...state.queue, ...tracks]
          const newIndex = replace ? 0 : state.queue.length
          // Auto-play if queue was empty OR playImmediately explicitly true
          const shouldPlay = (wasEmpty && !replace) || playImmediately === true
          return {
            queue: newQueue,
            currentIndex: newQueue.length > 0 ? (state.currentIndex === -1 ? newIndex : state.currentIndex) : -1,
            isPlaying: shouldPlay && newQueue.length > 0,
          }
        })
      },
      addAlbumToQueue: (album: Album, project: Project, options?: { replace?: boolean; playImmediately?: boolean }) => {
        const { replace = false, playImmediately = true } = options || {}
        // Convert album tracks to PlaylistTrack format, SORTED by track number
        const sortedTracks = [...(album.tracks || [])].sort((a, b) => {
          const numA = parseInt(a.number, 10) || 0
          const numB = parseInt(b.number, 10) || 0
          return numA - numB
        })
        const playlistTracks: PlaylistTrack[] = sortedTracks.flatMap((track) => {
          const audioVersion = getPreferredAudioVersion(track)
          return audioVersion ? [{ track, album, project, audioVersion }] : []
        })
        if (playlistTracks.length === 0) return

        // Get current queue length BEFORE adding to determine new track index
        const currentQueueLength = get().queue.length
        // Use the existing addTracksToQueue action
        get().addTracksToQueue(playlistTracks, { replace, playImmediately })
        // Open playlist panel
        get().setPlaylistOpen(true)
        // Dispatch playlist-play event for the first added track so App.tsx sets audioSrc
        const newTrackIndex = replace ? 0 : currentQueueLength
        const firstTrack = playlistTracks[0]
        if (firstTrack) {
          const audioPath = firstTrack.audioVersion?.path
          if (audioPath) {
            window.dispatchEvent(new CustomEvent('arqchives:playlist-play', {
              detail: { audioPath, index: newTrackIndex, item: firstTrack }
            }))
          }
        }
      },
      setQueuedTrackAudioVersion: (index, audioVersion, audioPath) =>
        set((state) => {
          if (!state.queue[index]) return state
          return {
            queue: state.queue.map((item, itemIndex) =>
              itemIndex === index ? { ...item, audioVersion, audioPath } : item
            ),
          }
        }),
      removeFromQueue: (index: number) =>
        set((state) => {
          const newQueue = state.queue.filter((_, i) => i !== index)
          let newIndex = state.currentIndex
          if (index < state.currentIndex) newIndex--
          else if (index === state.currentIndex) newIndex = Math.min(newIndex, newQueue.length - 1)
          return { queue: newQueue, currentIndex: newQueue.length > 0 ? newIndex : -1 }
        }),
      clearQueue: () => set({ queue: [], currentIndex: -1, isPlaying: false }),
      setCurrentIndex: (index: number) => set({ currentIndex: index, isPlaying: true }),
      playNext: () =>
        set((state) => {
          if (state.queue.length === 0) return { currentIndex: -1, isPlaying: false }
          let nextIndex = state.currentIndex + 1
          if (nextIndex >= state.queue.length) {
            if (state.repeat === 'all') nextIndex = 0
            else return { currentIndex: state.currentIndex, isPlaying: false }
          }
          return { currentIndex: nextIndex, isPlaying: true }
        }),
      playPrevious: () =>
        set((state) => {
          if (state.queue.length === 0) return { currentIndex: -1, isPlaying: false }
          let prevIndex = state.currentIndex - 1
          if (prevIndex < 0) {
            if (state.repeat === 'all') prevIndex = state.queue.length - 1
            else return { currentIndex: 0, isPlaying: true }
          }
          return { currentIndex: prevIndex, isPlaying: true }
        }),
      setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
      setRepeat: (mode: 'off' | 'all' | 'one') => set({ repeat: mode }),
      setShuffle: (shuffle: boolean) => set({ shuffle }),
      setPlaylistOpen: (open: boolean) => set({ isOpen: open }),
      setSidebarWidth: (width: number) => set({ sidebarWidth: Math.max(200, Math.min(600, width)) }),
      setPlaylistWidth: (width: number) => set({ playlistWidth: Math.max(280, Math.min(600, width)) }),
      setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
      setPlaylistCollapsed: (collapsed: boolean) => set({ playlistCollapsed: collapsed }),
      reorderQueue: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const newQueue = [...state.queue]
          const [removed] = newQueue.splice(fromIndex, 1)
          newQueue.splice(toIndex, 0, removed)
          let newIndex = state.currentIndex
          if (fromIndex === state.currentIndex) newIndex = toIndex
          else if (fromIndex < state.currentIndex && toIndex >= state.currentIndex) newIndex--
          else if (fromIndex > state.currentIndex && toIndex <= state.currentIndex) newIndex++
          return { queue: newQueue, currentIndex: newIndex }
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => electronStorage),
      partialize: (state) => ({
        appRoot: state.appRoot,
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        projectConfig: state.projectConfig,
        albums: state.albums,
        // Playlist UI state (NOT queue - contains runtime file:// URLs and nested objects)
        currentIndex: state.currentIndex,
        isPlaying: state.isPlaying,
        repeat: state.repeat,
        shuffle: state.shuffle,
        isOpen: state.isOpen,
      }),
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          // Migração da v1 para v2 - adicionar projetos padrão se não existirem
          return {
            ...persistedState,
            projects: persistedState.projects?.length ? persistedState.projects : DEFAULT_PROJECTS,
            activeProjectId: persistedState.activeProjectId || 'moab',
          }
        }
        if (version === 2) {
          // Migração da v2 para v3 - adicionar playlist state defaults
          return {
            ...persistedState,
            queue: persistedState.queue || [],
            currentIndex: persistedState.currentIndex ?? -1,
            isPlaying: persistedState.isPlaying ?? false,
            repeat: persistedState.repeat ?? 'off',
            shuffle: persistedState.shuffle ?? false,
            isOpen: persistedState.isOpen ?? false,
          }
        }
        if (version === 3) {
          // Migração da v3 para v4 - remover queue do persist (contém URLs file:// runtime)
          const { queue, ...rest } = persistedState
          return {
            ...rest,
            currentIndex: -1,
            isPlaying: false,
          }
        }
        return persistedState as AppState
      },
    }
  )
)

// ── Selectors ──────────────────────────────────────────────────────────────────
export const useProjects = () => useAppStore((state) => state.projects)
export const useActiveProject = () => useAppStore((state) =>
  state.projects.find(p => p.id === state.activeProjectId) || state.projects[0]
)
export const useActiveProjectId = () => useAppStore((state) => state.activeProjectId)
export const useAlbums = (projectId: string) => useAppStore((state) => state.albums[projectId] || [])
export const useAlbum = (projectId: string, albumId: string) => useAppStore((state) => 
  state.albums[projectId]?.find(a => a.id === albumId) || null
)
export const useTrack = (projectId: string, albumId: string, trackId: string) => useAppStore((state) => 
  state.albums[projectId]?.find(a => a.id === albumId)?.tracks.find(t => t.id === trackId) || null
)
export const useProjectConfig = () => useAppStore((state) => state.projectConfig)
export const useAppRoot = () => useAppStore((state) => state.appRoot)

// ── Playlist Selectors ─────────────────────────────────────────────────────────
export const usePlaylistQueue = () => useAppStore((state) => state.queue)
export const usePlaylistCurrentIndex = () => useAppStore((state) => state.currentIndex)
export const usePlaylistIsPlaying = () => useAppStore((state) => state.isPlaying)
export const usePlaylistRepeat = () => useAppStore((state) => state.repeat)
export const usePlaylistShuffle = () => useAppStore((state) => state.shuffle)
export const usePlaylistIsOpen = () => useAppStore((state) => state.isOpen)
export const usePlaylistCurrentTrack = () => useAppStore((state) => state.queue[state.currentIndex] || null)

// ── Layout Selectors ──────────────────────────────────────────────────────────
export const useSidebarWidth = () => useAppStore((state) => state.sidebarWidth)
export const usePlaylistWidth = () => useAppStore((state) => state.playlistWidth)
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed)
export const usePlaylistCollapsed = () => useAppStore((state) => state.playlistCollapsed)

// Individual action selectors (stable references)
export const useAddTracksToQueue = () => useAppStore((state) => state.addTracksToQueue)
export const useAddAlbumToQueue = () => useAppStore((state) => state.addAlbumToQueue)
export const useSetQueuedTrackAudioVersion = () => useAppStore((state) => state.setQueuedTrackAudioVersion)
export const useRemoveFromQueue = () => useAppStore((state) => state.removeFromQueue)
export const useClearQueue = () => useAppStore((state) => state.clearQueue)
export const useSetCurrentIndex = () => useAppStore((state) => state.setCurrentIndex)
export const usePlayNext = () => useAppStore((state) => state.playNext)
export const usePlayPrevious = () => useAppStore((state) => state.playPrevious)
export const useSetIsPlaying = () => useAppStore((state) => state.setIsPlaying)
export const useSetRepeat = () => useAppStore((state) => state.setRepeat)
export const useSetShuffle = () => useAppStore((state) => state.setShuffle)
export const useSetPlaylistOpen = () => useAppStore((state) => state.setPlaylistOpen)
export const useReorderQueue = () => useAppStore((state) => state.reorderQueue)
export const useSetSidebarWidth = () => useAppStore((state) => state.setSidebarWidth)
export const useSetPlaylistWidth = () => useAppStore((state) => state.setPlaylistWidth)
export const useSetSidebarCollapsed = () => useAppStore((state) => state.setSidebarCollapsed)
export const useSetPlaylistCollapsed = () => useAppStore((state) => state.setPlaylistCollapsed)
export const useShowConfig = () => useAppStore((state) => state.showConfig)
export const useSetShowConfig = () => useAppStore((state) => state.setShowConfig)
export const useShowTempFolder = () => useAppStore((state) => state.showTempFolder)
export const useSetShowTempFolder = () => useAppStore((state) => state.setShowTempFolder)

// Combined selectors with shallow (for convenience)
export const usePlaylist = () => useAppStore(
  (state) => ({
    queue: state.queue,
    currentIndex: state.currentIndex,
    isPlaying: state.isPlaying,
    repeat: state.repeat,
    shuffle: state.shuffle,
    currentTrack: state.queue[state.currentIndex] || null,
  }),
  shallow
)

export const usePlaylistActions = () => useAppStore(
  (state) => ({
    addTracksToQueue: state.addTracksToQueue,
    removeFromQueue: state.removeFromQueue,
    clearQueue: state.clearQueue,
    setCurrentIndex: state.setCurrentIndex,
    playNext: state.playNext,
    playPrevious: state.playPrevious,
    setIsPlaying: state.setIsPlaying,
    setRepeat: state.setRepeat,
    setShuffle: state.setShuffle,
    reorderQueue: state.reorderQueue,
  }),
  shallow
)