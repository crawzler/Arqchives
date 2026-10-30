// ── Declarações globais para Electron ──────────────────────────────────────────

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
  getAudioMetadata: (filePath: string) => Promise<{ duration: number | null; size: number }>
  readAudioFile: (filePath: string) => Promise<ArrayBuffer | null>

  // Store
  storeRead: (fileName: string) => Promise<string | null>
  storeWrite: (fileName: string, data: string) => Promise<boolean>
  getUserDataPath: () => Promise<string>
  setAppRootPath: (path: string) => Promise<boolean>

  // Backup
  backupExport: (opts?: { includeConfig?: boolean; includeProjects?: boolean; includeAlbums?: boolean; includeFiles?: boolean }) => Promise<{ ok: boolean; filePath?: string; error?: string }>
  backupImport: (zipPath: string) => Promise<{ ok: boolean; fileCount?: number; error?: string }>
  configExport: () => Promise<{ ok: boolean; config?: any; error?: string }>
  configImport: (config: any) => Promise<{ ok: boolean; error?: string }>

  // Eventos
  onElectronDropFiles: (callback: (paths: string[]) => void) => () => void
}

interface Window {
  electronAPI: ElectronAPI
}

// ── Extensões para FileFilter do Electron ──────────────────────────────────────
declare namespace Electron {
  interface FileFilter {
    name: string
    extensions: string[]
  }
}