import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),

  // Folders/Files
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectDestFolder: () => ipcRenderer.invoke('select-dest-folder'),
  selectFiles: (opts?: { title?: string; filters?: Electron.FileFilter[]; multiple?: boolean }) => ipcRenderer.invoke('select-files', opts),
  listFiles: (folderPath: string) => ipcRenderer.invoke('list-files', folderPath),
  listFilesRecursive: (folderPath: string) => ipcRenderer.invoke('list-files-recursive', folderPath),
  fileExists: (filePath: string) => ipcRenderer.invoke('file-exists', filePath),
  openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  revealFile: (filePath: string) => ipcRenderer.invoke('reveal-file', filePath),
  renameFile: (oldPath: string, newName: string) => ipcRenderer.invoke('rename-file', { oldPath, newName }),
  deleteFile: (filePath: string) => ipcRenderer.invoke('delete-file', filePath),
  moveFile: (filePath: string, destFolder: string) => ipcRenderer.invoke('move-file', { filePath, destFolder }),
  copyFile: (filePath: string, destFolder: string) => ipcRenderer.invoke('copy-file', { filePath, destFolder }),
  createFolder: (parentPath: string, folderName: string) => ipcRenderer.invoke('create-folder', { parentPath, folderName }),
  ensureFolder: (dirPath: string) => ipcRenderer.invoke('ensure-folder', dirPath),
  moveOrCopyFile: (opts: { srcPath: string; destFolder: string; fileName?: string; mode: 'move' | 'copy' }) => ipcRenderer.invoke('move-or-copy-file', opts),
  getLocalUrl: (filePath: string) => ipcRenderer.invoke('get-local-url', filePath),
  dragOutFile: (filePath: string) => ipcRenderer.send('drag-out-file', filePath),
  getAudioMetadata: (filePath: string) => ipcRenderer.invoke('get-audio-metadata', filePath),
  readAudioFile: (filePath: string) => ipcRenderer.invoke('read-audio-file', filePath),

  // Store
  storeRead: (fileName: string) => ipcRenderer.invoke('store-read', fileName),
  storeWrite: (fileName: string, data: string) => ipcRenderer.invoke('store-write', { fileName, data }),
  storeRemove: (fileName: string) => ipcRenderer.invoke('store-remove', fileName),
  debugLog: (message: string, data?: any) => ipcRenderer.invoke('debug-log', message, data),
  getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
  setAppRootPath: (path: string) => ipcRenderer.invoke('set-app-root-path', path),
  getRecommendedAppPath: () => ipcRenderer.invoke('get-recommended-app-path'),

  // Backup
  backupExport: (opts?: { includeConfig?: boolean; includeProjects?: boolean; includeAlbums?: boolean; includeFiles?: boolean }) => ipcRenderer.invoke('backup-export', opts),
  backupImport: (zipPath: string) => ipcRenderer.invoke('backup-import', zipPath),
  configExport: () => ipcRenderer.invoke('config-export'),
  configImport: (config: any) => ipcRenderer.invoke('config-import', config),

  // Legacy APIs (for compatibility)
  selectRootFolder: () => ipcRenderer.invoke('select-root-folder'),
  getRootFolder: () => ipcRenderer.invoke('get-root-folder'),
  listProjects: () => ipcRenderer.invoke('list-projects'),
  createProject: (data: { name: string; rootFolder: string }) => ipcRenderer.invoke('create-project', data),
  readProjectConfig: (projectPath: string) => ipcRenderer.invoke('read-project-config', projectPath),
  writeProjectConfig: (data: { projectPath: string; config: any }) => ipcRenderer.invoke('write-project-config', data),
  readFile: (filePath: string) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (data: { filePath: string; content: string }) => ipcRenderer.invoke('write-file', data),
  copyFileLegacy: (data: { src: string; dest: string }) => ipcRenderer.invoke('copy-file-legacy', data),
  moveFileLegacy: (data: { src: string; dest: string }) => ipcRenderer.invoke('move-file-legacy', data),
  deleteFileLegacy: (filePath: string) => ipcRenderer.invoke('delete-file-legacy', filePath),
  openFolder: (folderPath: string) => ipcRenderer.invoke('open-folder', folderPath),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  saveAlbum: (data: { projectPath: string; album: any }) => ipcRenderer.invoke('save-album', data),
  deleteAlbum: (data: { projectPath: string; albumId: string }) => ipcRenderer.invoke('delete-album', data),
  exportProject: (data: { projectPath: string; outputPath: string }) => ipcRenderer.invoke('export-project', data),

  // Events
  onElectronDropFiles: (callback: (paths: string[]) => void) => {
    const handler = (_: any, paths: string[]) => callback(paths)
    ipcRenderer.on('electron-drop-files', handler)
    return () => ipcRenderer.off('electron-drop-files', handler)
  },
})

declare global {
  interface Window {
    electronAPI: {
      minimize: () => void
      maximize: () => void
      close: () => void
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
      readAudioFile: (filePath: string) => Promise<ArrayBuffer | Uint8Array | null>
      storeRead: (fileName: string) => Promise<string | null>
      storeWrite: (fileName: string, data: string) => Promise<boolean>
      storeRemove: (fileName: string) => Promise<boolean>
      debugLog: (message: string, data?: any) => Promise<boolean>
      getUserDataPath: () => Promise<string>
      setAppRootPath: (path: string) => Promise<boolean>
      getRecommendedAppPath: () => Promise<string>
      backupExport: (opts?: { includeConfig?: boolean; includeProjects?: boolean; includeAlbums?: boolean; includeFiles?: boolean }) => Promise<{ ok: boolean; filePath?: string; error?: string }>
      backupImport: (zipPath: string) => Promise<{ ok: boolean; fileCount?: number; error?: string }>
      configExport: () => Promise<{ ok: boolean; config?: any; error?: string }>
      configImport: (config: any) => Promise<{ ok: boolean; error?: string }>
      onElectronDropFiles: (callback: (paths: string[]) => void) => () => void

      // Legacy
      selectRootFolder: () => Promise<string | null>
      getRootFolder: () => Promise<string | null>
      listProjects: () => Promise<string[]>
      createProject: (data: { name: string; rootFolder: string }) => Promise<{ success: boolean; path?: string; error?: string }>
      readProjectConfig: (projectPath: string) => Promise<any>
      writeProjectConfig: (data: { projectPath: string; config: any }) => Promise<{ success: boolean; error?: string }>
      readFile: (filePath: string) => Promise<string | null>
      writeFile: (data: { filePath: string; content: string }) => Promise<{ success: boolean; error?: string }>
      copyFileLegacy: (data: { src: string; dest: string }) => Promise<{ success: boolean; error?: string }>
      moveFileLegacy: (data: { src: string; dest: string }) => Promise<{ success: boolean; error?: string }>
      deleteFileLegacy: (filePath: string) => Promise<{ success: boolean; error?: string }>
      openFolder: (folderPath: string) => Promise<{ success: boolean; error?: string }>
      openExternal: (url: string) => Promise<{ success: boolean; error?: string }>
      saveAlbum: (data: { projectPath: string; album: any }) => Promise<{ success: boolean; error?: string }>
      deleteAlbum: (data: { projectPath: string; albumId: string }) => Promise<{ success: boolean; error?: string }>
      exportProject: (data: { projectPath: string; outputPath: string }) => Promise<{ success: boolean; size?: number; error?: string }>
    }
  }
}