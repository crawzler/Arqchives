// ── Tipos principais ────────────────────────────────────────────────────────────

export type TrackStatus = 'idea' | 'composing' | 'recording' | 'mixing' | 'mastering' | 'done'

export interface TrackStatusInfo {
  label: string
  color: string
}

export const TRACK_STATUSES: Record<TrackStatus, TrackStatusInfo> = {
  idea: { label: '💡 Ideia', color: '#64748b' },
  composing: { label: '🎼 Composição', color: '#3b82f6' },
  recording: { label: '🎙️ Gravação', color: '#f59e0b' },
  mixing: { label: '🎚️ Mixagem', color: '#8b5cf6' },
  mastering: { label: '🎧 Masterização', color: '#ec4899' },
  done: { label: '✅ Finalizado', color: '#22c55e' },
}

export interface AudioVersion {
  id: string
  label: string
  type: 'draft' | 'mix' | 'master' | 'instrumental' | 'acapella' | 'other'
  path: string
  createdAt: number
}

export interface PlaylistTrack {
  track: Track
  album: Album
  project: Project
  audioVersion?: AudioVersion
  audioPath?: string
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export interface SocialMeta {
  full: SocialMetaItem
  short: SocialMetaItem
}

export interface SocialMetaItem {
  title: string
  description: string
  hashtags: string
  credits: string
}

export interface LyricSyncEntry {
  text: string
  startTime: number | null
  endTime?: number | null
}

export interface Track {
  id: string
  number: string
  title: string
  bpm: string
  key: string
  status: TrackStatus
  notes: string
  audioVersions: AudioVersion[]
  versionMode: 'single' | 'dual' // 'single' = apenas versão final, 'dual' = pré-mix + master
  // AI Fields
  lyrics: string
  lyricSync?: LyricSyncEntry[]
  prompt: string
  positivePrompt: string
  style: string
  mode: string
  social: SocialMeta
  files: string[]
  todos: TodoItem[]
  createdAt: number
}

export interface Album {
  id: string
  title: string
  type: 'Álbum' | 'EP' | 'Single' | 'Compilação'
  year: number
  description: string
  coverPath: string | null // file path (relative to appRoot or absolute)
  files: string[]
  todos: TodoItem[]
  tracks: Track[]
  social: SocialMeta
  createdAt: number
}

export interface Project {
  id: string
  name: string
  genre: string
  accent: string
  photo: string // file path (relative to appRoot or absolute)
}

export type ReleaseType = 'Álbum' | 'EP' | 'Single' | 'Compilação'

export const RELEASE_TYPES: ReleaseType[] = ['Álbum', 'EP', 'Single', 'Compilação']

// ── TAGS System (substitui typeMapping) ────────────────────────────────────────

export interface Tag {
  id: string
  label: string
  extensions: string[]
  color?: string
  isSystem?: boolean // tags do sistema não podem ser deletadas
}

export const DEFAULT_TAGS: Tag[] = [
  { id: 'audio', label: 'Audio', extensions: ['.mp3', '.wav', '.flac', '.aiff', '.ogg', '.m4a', '.aac', '.wma'], color: '#22c55e', isSystem: true },
  { id: 'stems', label: 'Stems', extensions: ['.wav', '.flac', '.aiff'], color: '#3b82f6', isSystem: true },
  { id: 'daw', label: 'DAW', extensions: ['.als', '.flp', '.ptx', '.logic', '.rpp', '.cpr', '.nki', '.adg', '.alc'], color: '#a855f7', isSystem: true },
  { id: 'midi', label: 'Midi', extensions: ['.mid', '.midi', '.kar'], color: '#f97316', isSystem: true },
  { id: 'imagens', label: 'Imagens', extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff', '.psd', '.ai'], color: '#ec4899', isSystem: true },
  { id: 'videos', label: 'Videos', extensions: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv', '.flv'], color: '#06b6d4', isSystem: true },
  { id: 'docs', label: 'Docs', extensions: ['.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.md', '.rtf'], color: '#84cc16', isSystem: true },
  { id: 'todos', label: 'Todos', extensions: [], color: '#64748b', isSystem: true }, // catch-all, extensões vazias = aceita tudo
]

// ── Folder Structure Config ────────────────────────────────────────────────────

export interface FolderTagConfig {
  // Mapeia pasta -> array de tag IDs permitidos
  projectFolders: Record<string, string[]>
  albumFolders: Record<string, string[]>
  trackFolders: Record<string, string[]>
  trackSubfolders: Record<string, string[]> // para subpastas aninhadas (ex: Stems/VOX)
}

export const DEFAULT_FOLDER_TAG_CONFIG: FolderTagConfig = {
  projectFolders: {
    'Artwork': ['imagens'],
    'Videos': ['videos'],
    'Documentos': ['docs'],
    'Assets': ['todos'],
    'Referencias': ['todos'],
    'Outros': ['todos'],
  },
  albumFolders: {
    'Artwork': ['imagens'],
    'Videos': ['videos'],
    'Documentos': ['docs'],
    'Assets': ['todos'],
    'Referencias': ['todos'],
    'Outros': ['todos'],
  },
  trackFolders: {
    'track': ['audio'],
    'Artwork': ['imagens'],
    'Videos': ['videos'],
    'Social Media': ['imagens', 'videos'],
    'Stems': ['audio', 'stems'],
    'DAW': ['daw'],
  },
  trackSubfolders: {
    'Stems/VOX': ['audio', 'stems'],
    'Stems/BASS': ['audio', 'stems'],
    'Stems/DRUMS': ['audio', 'stems'],
    'Stems/GUITARS': ['audio', 'stems'],
    'Stems/ATMOS': ['audio', 'stems'],
    'Stems/MORE': ['audio', 'stems'],
  },
}

// ── Configuração de estrutura de pastas ────────────────────────────────────────

export interface FolderStructureConfig {
  albumTemplate: string
  trackTemplate: string
  trackSubfolders: string[] // pastas diretas da track
  albumSubfolders: string[]
  projectSubfolders: string[]
  // trackFolderTypeMap removido - agora usa folderTagConfig
}

export interface FileHandlingConfig {
  mode: 'move' | 'copy'
  // enableTypeMapping removido - agora usa tags
}

export interface NamingConfig {
  trackNumberFormat: '02d' | '03d' | 'none'
  trackSeparator: string
  sanitizeNames: boolean
}

export interface TodoTemplatesConfig {
  album: string[]
  track: string[]
  showInProjects: boolean
}

export interface ProjectConfig {
  folderStructure: FolderStructureConfig
  fileHandling: FileHandlingConfig
  naming: NamingConfig
  todoTemplates: TodoTemplatesConfig
  tags: Tag[] // tags personalizáveis do usuário
  folderTagConfig: FolderTagConfig // quais tags cada pasta aceita
}

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  folderStructure: {
    albumTemplate: '{albumTitle}',
    trackTemplate: '{trackNumber} - {trackTitle}',
    trackSubfolders: [
      'track',
      'Artwork',
      'Videos',
      'Social Media',
      'Stems',
      'DAW',
    ],
    albumSubfolders: [
      'Artwork',
      'Videos',
      'Documentos',
      'Assets',
      'Referencias',
      'Outros',
    ],
    projectSubfolders: [
      'Artwork',
      'Videos',
      'Documentos',
      'Assets',
      'Referencias',
      'Outros',
    ],
  },
  fileHandling: {
    mode: 'copy',
  },
  naming: {
    trackNumberFormat: '02d',
    trackSeparator: ' - ',
    sanitizeNames: true,
  },
  todoTemplates: {
    album: [
      'Definir conceito e tema',
      'Finalizar tracklist',
      'Criar arte da capa',
      'Masterizar todas as faixas',
      'Distribuição / lançamento',
    ],
    track: [
      'Compor melodia e harmonia',
      'Gravar instrumentos',
      'Mixagem',
      'Revisão final',
    ],
    showInProjects: true,
  },
  tags: DEFAULT_TAGS,
  folderTagConfig: DEFAULT_FOLDER_TAG_CONFIG,
}

// ── Paths gerados ──────────────────────────────────────────────────────────────

export interface AlbumPaths {
  albumPath: string
  albumSubfolders: Record<string, string>
  trackPath?: string
  trackSubfolders?: Record<string, string>
}

export interface ProjectPaths {
  projectPath: string
  subfolders: Record<string, string>
}

// ── Store Types ────────────────────────────────────────────────────────────────

export interface AppState {
  // App root folder
  appRoot: string | null
  setAppRoot: (path: string) => void
  clearAppRoot: () => void
  resetApp: () => void

  // Projects
  projects: Project[]
  activeProjectId: string | null
  setActiveProject: (id: string) => void
  addProject: (project: Omit<Project, 'id'>) => Project
  updateProject: (id: string, changes: Partial<Project>) => void
  deleteProject: (id: string) => void
  reorderProjects: (projects: Project[]) => void

  // Project Config
  projectConfig: ProjectConfig
  updateProjectConfig: (config: Partial<ProjectConfig>) => void
  resetProjectConfig: () => void

  // Tags management
  addTag: (tag: Omit<Tag, 'id'>) => Tag
  updateTag: (id: string, changes: Partial<Tag>) => void
  deleteTag: (id: string) => void
  reorderTags: (tags: Tag[]) => void

  // Folder Tag Config management
  updateFolderTagConfig: (config: Partial<FolderTagConfig>) => void
  resetFolderTagConfig: () => void

  // Albums (per project)
  albums: Record<string, Album[]>
  addAlbum: (projectId: string, album: Omit<Album, 'id' | 'createdAt'>) => Album
  updateAlbum: (projectId: string, albumId: string, changes: Partial<Album>) => void
  deleteAlbum: (projectId: string, albumId: string) => void
  reorderAlbums: (projectId: string, albums: Album[]) => void

  // Tracks (per album)
  addTrack: (projectId: string, albumId: string, track: Partial<Omit<Track, 'id' | 'createdAt'>>) => Track
  updateTrack: (projectId: string, albumId: string, trackId: string, changes: Partial<Track>) => void
  deleteTrack: (projectId: string, albumId: string, trackId: string) => void
  reorderTracks: (projectId: string, albumId: string, tracks: Track[]) => void

  // Files
  addAlbumFile: (projectId: string, albumId: string, filePath: string) => void
  removeAlbumFile: (projectId: string, albumId: string, filePath: string) => void
  addTrackFile: (projectId: string, albumId: string, trackId: string, filePath: string) => void
  removeTrackFile: (projectId: string, albumId: string, trackId: string, filePath: string) => void

  // Todos
  addAlbumTodo: (projectId: string, albumId: string, text: string) => TodoItem
  updateAlbumTodo: (projectId: string, albumId: string, todoId: string, changes: Partial<TodoItem>) => void
  deleteAlbumTodo: (projectId: string, albumId: string, todoId: string) => void
  reorderAlbumTodos: (projectId: string, albumId: string, todos: TodoItem[]) => void
  addTrackTodo: (projectId: string, albumId: string, trackId: string, text: string) => TodoItem
  updateTrackTodo: (projectId: string, albumId: string, trackId: string, todoId: string, changes: Partial<TodoItem>) => void
  deleteTrackTodo: (projectId: string, albumId: string, trackId: string, todoId: string) => void
  reorderTrackTodos: (projectId: string, albumId: string, trackId: string, todos: TodoItem[]) => void

  // Sync
  scanAndSync: (projectId: string) => Promise<void>

  // UI State
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  showConfig: boolean
  setShowConfig: (show: boolean) => void
  showTempFolder: boolean
  setShowTempFolder: (show: boolean) => void

  // Playlist / Queue
  queue: PlaylistTrack[]
  currentIndex: number
  isPlaying: boolean
  repeat: 'off' | 'all' | 'one'
  shuffle: boolean
  isOpen: boolean
  setPlaylistOpen: (open: boolean) => void
  addTracksToQueue: (tracks: PlaylistTrack[], options?: { replace?: boolean; playImmediately?: boolean }) => void
  addAlbumToQueue: (album: Album, project: Project, options?: { replace?: boolean; playImmediately?: boolean }) => void
  setQueuedTrackAudioVersion: (index: number, audioVersion: AudioVersion, audioPath: string) => void

  // UI Layout State
  sidebarWidth: number
  playlistWidth: number
  sidebarCollapsed: boolean
  playlistCollapsed: boolean
  setSidebarWidth: (width: number) => void
  setPlaylistWidth: (width: number) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setPlaylistCollapsed: (collapsed: boolean) => void
}