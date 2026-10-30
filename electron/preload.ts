import { contextBridge, ipcRenderer } from 'electron'

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface ElectronAPI {
  // Janela
  minimize: () => void
  maximize: () => void
  close: () => void

  // Pastas/Arquivos
  selectFolder: () => Promise<string | null>
  selectDestFolder: () => Promise<string | null>
  selectFiles: (opts?: { title?: string; filters?: Electron.FileFilter[]; multiple?: boolean }) => Promise<string[] | null>
  listFiles: (folderPath: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string; ext: string; size: number }>>
  listFilesRecursive: (folderPath: string) => Promise<Array<{ name: string; isDirectory: boolean; path: string; ext: string; size: number; relativePath: string }>>
  fileExists: (filePath: string) => Promise<boolean>
  openFile: (filePath: string) => Promise<void>
  revealFile: (filePath: string) => Promise<void>
  renameFile: (oldPath: string, newName: string) => Promise<{ ok: boolean; newPath?: string; error?: string }>
  deleteFile: (filePath: string) => Promise<{ ok: boolean; error?: string }>
  moveFile: (filePath: string, destFolder: string) => Promise<{ ok: boolean; newPath?: string; error?: string }>
  copyFile: (filePath: string, destFolder: string) => Promise<{ ok: boolean; newPath?: string; error?: string }>
  createFolder: (parentPath: string, folderName: string) => Promise<{ ok: boolean; newPath?: string; error?: string }>
  ensureFolder: (dirPath: string) => Promise<{ ok: boolean; error?: string }>
  moveOrCopyFile: (opts: { srcPath: string; destFolder: string; fileName?: string; mode: 'move' | 'copy' }) => Promise<{ ok: boolean; newPath?: string; error?: string }>
  getLocalUrl: (filePath: string) => Promise<string | null>
  dragOutFile: (filePath: string) => void
  getRecommendedAppPath: () => Promise<string>
  getAudioMetadata: (filePath: string) => Promise<{ duration: number | null; size: number }>

  // Waveform - read audio file as ArrayBuffer for waveform generation
  readAudioFile: (filePath: string) => Promise<ArrayBuffer>

  // Store
  storeRead: (fileName: string) => Promise<string | null>
  storeWrite: (fileName: string, data: string) => Promise<boolean>
  getUserDataPath: () => Promise<string>

  // Eventos
  onElectronDropFiles: (callback: (paths: string[]) => void) => () => void
}

// ── API ───────────────────────────────────────────────────────────────────────
const electronAPI: ElectronAPI = {
  // Janela
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // Pastas/Arquivos
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectDestFolder: () => ipcRenderer.invoke('select-dest-folder'),
  selectFiles: (opts) => ipcRenderer.invoke('select-files', opts),
  listFiles: (folderPath) => ipcRenderer.invoke('list-files', folderPath),
  listFilesRecursive: (folderPath) => ipcRenderer.invoke('list-files-recursive', folderPath),
  fileExists: (filePath) => ipcRenderer.invoke('file-exists', filePath),
  openFile: (filePath) => ipcRenderer.invoke('open-file', filePath),
  revealFile: (filePath) => ipcRenderer.invoke('reveal-file', filePath),
  renameFile: (oldPath, newName) => ipcRenderer.invoke('rename-file', oldPath, newName),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  moveFile: (filePath, destFolder) => ipcRenderer.invoke('move-file', filePath, destFolder),
  copyFile: (filePath, destFolder) => ipcRenderer.invoke('copy-file', filePath, destFolder),
  createFolder: (parentPath, folderName) => ipcRenderer.invoke('create-folder', parentPath, folderName),
  ensureFolder: (dirPath) => ipcRenderer.invoke('ensure-folder', dirPath),
  moveOrCopyFile: (opts) => ipcRenderer.invoke('move-or-copy-file', opts),
  getLocalUrl: (filePath) => ipcRenderer.invoke('get-local-url', filePath),
  dragOutFile: (filePath) => ipcRenderer.send('drag-out-file', filePath),

  // Store
  storeRead: (fileName) => ipcRenderer.invoke('store-read', fileName),
  storeWrite: (fileName, data) => ipcRenderer.invoke('store-write', fileName, data),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  setAppRootPath: (path: string) => ipcRenderer.invoke('set-app-root', path),
  getRecommendedAppPath: () => ipcRenderer.invoke('get-recommended-app-path'),
  getAudioMetadata: (filePath: string) => ipcRenderer.invoke('get-audio-metadata', filePath),
  readAudioFile: (filePath: string) => ipcRenderer.invoke('read-audio-file', filePath),

  // Backup
  backupExport: (opts?: { includeConfig?: boolean; includeProjects?: boolean; includeAlbums?: boolean; includeFiles?: boolean }) => ipcRenderer.invoke('backup-export', opts),
  backupImport: (zipPath: string) => ipcRenderer.invoke('backup-import', zipPath),
  configExport: () => ipcRenderer.invoke('config-export'),
  configImport: (config: any) => ipcRenderer.invoke('config-import', config),

  // Eventos
  onElectronDropFiles: (callback) => {
    const handler = (_: any, paths: string[]) => callback(paths)
    ipcRenderer.on('electron-drop-files', handler)
    return () => ipcRenderer.off('electron-drop-files', handler)
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

// ── Evento de drop externo ────────────────────────────────────────────────────
// O main process pode enviar 'electron-drop-files' quando arquivos são dropados na janela
// Isso é capturado pelo listener acima