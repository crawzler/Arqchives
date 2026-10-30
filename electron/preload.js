"use strict";

// electron/preload.ts
var import_electron = require("electron");
var electronAPI = {
  // Janela
  minimize: () => import_electron.ipcRenderer.send("window-minimize"),
  maximize: () => import_electron.ipcRenderer.send("window-maximize"),
  close: () => import_electron.ipcRenderer.send("window-close"),
  // Pastas/Arquivos
  selectFolder: () => import_electron.ipcRenderer.invoke("select-folder"),
  selectDestFolder: () => import_electron.ipcRenderer.invoke("select-dest-folder"),
  selectFiles: (opts) => import_electron.ipcRenderer.invoke("select-files", opts),
  listFiles: (folderPath) => import_electron.ipcRenderer.invoke("list-files", folderPath),
  listFilesRecursive: (folderPath) => import_electron.ipcRenderer.invoke("list-files-recursive", folderPath),
  fileExists: (filePath) => import_electron.ipcRenderer.invoke("file-exists", filePath),
  openFile: (filePath) => import_electron.ipcRenderer.invoke("open-file", filePath),
  revealFile: (filePath) => import_electron.ipcRenderer.invoke("reveal-file", filePath),
  renameFile: (oldPath, newName) => import_electron.ipcRenderer.invoke("rename-file", oldPath, newName),
  deleteFile: (filePath) => import_electron.ipcRenderer.invoke("delete-file", filePath),
  moveFile: (filePath, destFolder) => import_electron.ipcRenderer.invoke("move-file", filePath, destFolder),
  copyFile: (filePath, destFolder) => import_electron.ipcRenderer.invoke("copy-file", filePath, destFolder),
  createFolder: (parentPath, folderName) => import_electron.ipcRenderer.invoke("create-folder", parentPath, folderName),
  ensureFolder: (dirPath) => import_electron.ipcRenderer.invoke("ensure-folder", dirPath),
  moveOrCopyFile: (opts) => import_electron.ipcRenderer.invoke("move-or-copy-file", opts),
  getLocalUrl: (filePath) => import_electron.ipcRenderer.invoke("get-local-url", filePath),
  dragOutFile: (filePath) => import_electron.ipcRenderer.send("drag-out-file", filePath),
  // Store
  storeRead: (fileName) => import_electron.ipcRenderer.invoke("store-read", fileName),
  storeWrite: (fileName, data) => import_electron.ipcRenderer.invoke("store-write", fileName, data),
  getUserDataPath: () => import_electron.ipcRenderer.invoke("get-user-data-path"),
  setAppRootPath: (path) => import_electron.ipcRenderer.invoke("set-app-root", path),
  getRecommendedAppPath: () => import_electron.ipcRenderer.invoke("get-recommended-app-path"),
  getAudioMetadata: (filePath) => import_electron.ipcRenderer.invoke("get-audio-metadata", filePath),
  readAudioFile: (filePath) => import_electron.ipcRenderer.invoke("read-audio-file", filePath),
  // Backup
  backupExport: (opts) => import_electron.ipcRenderer.invoke("backup-export", opts),
  backupImport: (zipPath) => import_electron.ipcRenderer.invoke("backup-import", zipPath),
  configExport: () => import_electron.ipcRenderer.invoke("config-export"),
  configImport: (config) => import_electron.ipcRenderer.invoke("config-import", config),
  // Eventos
  onElectronDropFiles: (callback) => {
    const handler = (_, paths) => callback(paths);
    import_electron.ipcRenderer.on("electron-drop-files", handler);
    return () => import_electron.ipcRenderer.off("electron-drop-files", handler);
  }
};
import_electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
