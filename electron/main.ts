import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'

// __dirname is injected by esbuild when bundling for CJS
declare const __dirname: string

const isDev = !app.isPackaged

function getPreloadPath() {
  if (isDev) {
    return path.join(process.cwd(), 'electron/preload.js')
  }
  return path.join(process.resourcesPath, 'electron', 'preload.js')
}

function getIconPath() {
  if (isDev) {
    return path.join(process.cwd(), 'public/icon.ico')
  }
  return path.join(process.resourcesPath, 'icon.ico')
}

function getDistPath() {
  if (isDev) {
    return path.join(process.cwd(), 'dist/index.html')
  }
  return path.join(__dirname, '..', 'dist', 'index.html')
}

function getDataPath(fileName: string) {
  return path.join(app.getPath('userData'), fileName)
}

function readDataFile(fileName: string): string | null {
  try {
    const p = getDataPath(fileName)
    if (!fs.existsSync(p)) return null
    return fs.readFileSync(p, 'utf-8')
  } catch { return null }
}

function writeDataFile(fileName: string, data: string): boolean {
  try {
    const p = getDataPath(fileName)
    fs.mkdirSync(path.dirname(p), { recursive: true })
    fs.writeFileSync(p, data, 'utf-8')
    return true
  } catch { return false }
}

function removeDataFile(fileName: string): boolean {
  try {
    const p = getDataPath(fileName)
    if (fs.existsSync(p)) fs.unlinkSync(p)
    return true
  } catch { return false }
}

function migrateFromDev() {
  const devDataPath = path.join(path.dirname(app.getPath('userData')), 'archives-app')
  if (!fs.existsSync(devDataPath)) return

  const filesToMigrate = ['albums.json', 'app-root.txt', 'project-config.json']
  for (const fileName of filesToMigrate) {
    const src = path.join(devDataPath, fileName)
    const dest = getDataPath(fileName)
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest)
    }
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
    },
    icon: getIconPath(),
  })

  if (isDev) {
    const tryLoad = async (attempt = 0) => {
      const ports = [50000, 50001, 50002, 50003, 50004, 50005, 50006, 50007, 50008, 50009, 50010]
      for (const port of ports) {
        try {
          const res = await fetch(`http://localhost:${port}/`).catch(() => null)
          if (res?.ok) {
            const text = await res.text()
            if (text.includes('type="module"') || text.includes('/@vite/')) {
              win.loadURL(`http://localhost:${port}`)
              return
            }
          }
        } catch { }
      }
      if (attempt < 30) {
        setTimeout(() => tryLoad(attempt + 1), 500)
      } else {
        win.loadURL('http://localhost:50001')
      }
    }
    tryLoad()
  } else {
    win.loadFile(getDistPath())
  }

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' && input.type === 'keyDown') {
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools()
      } else {
        win.webContents.openDevTools({ mode: 'detach' })
      }
    }
  })

  // Handle external drag-out
  ipcMain.on('drag-out-file', (_e, filePath: string) => {
    win.webContents.startDrag({
      file: filePath,
      icon: win.getNativeImage?.() || undefined,
    })
  })
}

app.whenReady().then(() => {
  migrateFromDev()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ── Window Controls ──────────────────────────────────────────────────────────────
ipcMain.handle('window-minimize', (_e) => {
  const win = BrowserWindow.getFocusedWindow()
  win?.minimize()
})
ipcMain.handle('window-maximize', (_e) => {
  const win = BrowserWindow.getFocusedWindow()
  if (win?.isMaximized()) win.unmaximize()
  else win?.maximize()
})
ipcMain.handle('window-close', (_e) => {
  const win = BrowserWindow.getFocusedWindow()
  win?.close()
})

// ── Folder/File Operations ───────────────────────────────────────────────────────
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Selecione uma pasta',
  })
  if (!result.canceled && result.filePaths.length > 0) return result.filePaths[0]
  return null
})

ipcMain.handle('select-dest-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Selecione a pasta de destino',
  })
  if (!result.canceled && result.filePaths.length > 0) return result.filePaths[0]
  return null
})

ipcMain.handle('select-files', async (_e, opts?: { title?: string; filters?: Electron.FileFilter[]; multiple?: boolean }) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', opts?.multiple ? 'multiSelections' : ''].filter(Boolean) as any,
    title: opts?.title || 'Selecione arquivos',
    filters: opts?.filters,
  })
  if (!result.canceled && result.filePaths.length > 0) return result.filePaths
  return null
})

ipcMain.handle('list-files', async (_e, folderPath: string) => {
  try {
    if (!fs.existsSync(folderPath)) return []
    const entries = fs.readdirSync(folderPath, { withFileTypes: true })
    return entries.map(e => ({
      name: e.name,
      isDirectory: e.isDirectory(),
      path: path.join(folderPath, e.name),
      ext: path.extname(e.name).toLowerCase(),
      size: e.isFile() ? fs.statSync(path.join(folderPath, e.name)).size : 0,
    }))
  } catch { return [] }
})

ipcMain.handle('list-files-recursive', async (_e, folderPath: string) => {
  try {
    if (!fs.existsSync(folderPath)) return []
    const results: Array<{ name: string; isDirectory: boolean; path: string; ext: string; size: number; relativePath: string }> = []
    const walk = (dir: string, base: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relPath = path.relative(base, fullPath)
        if (entry.isDirectory()) {
          results.push({ name: entry.name, isDirectory: true, path: fullPath, ext: '', size: 0, relativePath: relPath })
          walk(fullPath, base)
        } else {
          const stat = fs.statSync(fullPath)
          results.push({ name: entry.name, isDirectory: false, path: fullPath, ext: path.extname(entry.name).toLowerCase(), size: stat.size, relativePath: relPath })
        }
      }
    }
    walk(folderPath, folderPath)
    return results
  } catch { return [] }
})

ipcMain.handle('file-exists', async (_e, filePath: string) => {
  try { return fs.existsSync(filePath) } catch { return false }
})

ipcMain.handle('open-file', async (_e, filePath: string) => {
  try { await shell.openPath(filePath) } catch { }
})

ipcMain.handle('reveal-file', async (_e, filePath: string) => {
  try { await shell.showItemInFolder(filePath) } catch { }
})

ipcMain.handle('rename-file', async (_e, { oldPath, newName }: { oldPath: string; newName: string }) => {
  try {
    const newPath = path.join(path.dirname(oldPath), newName)
    fs.renameSync(oldPath, newPath)
    return { ok: true, newPath }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('delete-file', async (_e, filePath: string) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    return { ok: true }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('move-file', async (_e, { filePath, destFolder }: { filePath: string; destFolder: string }) => {
  try {
    const fileName = path.basename(filePath)
    const newPath = path.join(destFolder, fileName)
    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    fs.renameSync(filePath, newPath)
    return { ok: true, newPath }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('copy-file', async (_e, { filePath, destFolder }: { filePath: string; destFolder: string }) => {
  try {
    const fileName = path.basename(filePath)
    const newPath = path.join(destFolder, fileName)
    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    fs.copyFileSync(filePath, newPath)
    return { ok: true, newPath }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('create-folder', async (_e, { parentPath, folderName }: { parentPath: string; folderName: string }) => {
  try {
    const newPath = path.join(parentPath, folderName)
    fs.mkdirSync(newPath, { recursive: true })
    return { ok: true, newPath }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('ensure-folder', async (_e, dirPath: string) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true })
    return { ok: true }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('move-or-copy-file', async (_e, opts: { srcPath: string; destFolder: string; fileName?: string; mode: 'move' | 'copy' }) => {
  try {
    const fileName = opts.fileName || path.basename(opts.srcPath)
    const newPath = path.join(opts.destFolder, fileName)
    fs.mkdirSync(path.dirname(newPath), { recursive: true })
    if (opts.mode === 'move') fs.renameSync(opts.srcPath, newPath)
    else fs.copyFileSync(opts.srcPath, newPath)
    return { ok: true, newPath }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('get-local-url', async (_e, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return null
    // Return a file:// URL with 3 slashes for Windows (file:///C:/path)
    return `file:///${filePath.replace(/\\/g, '/')}`
  } catch { return null }
})

// Audio metadata
ipcMain.handle('get-audio-metadata', async (_e, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return { duration: null, size: 0 }
    const stat = fs.statSync(filePath)
    // For now return basic info; can integrate music-metadata later
    return { duration: null, size: stat.size }
  } catch { return { duration: null, size: 0 } }
})

ipcMain.handle('read-audio-file', async (_e, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return null
    return fs.readFileSync(filePath)
  } catch { return null }
})

// ── Store Persistence ────────────────────────────────────────────────────────────
ipcMain.handle('store-read', async (_e, fileName: string) => {
  return readDataFile(fileName)
})

ipcMain.handle('store-write', async (_e, { fileName, data }: { fileName: string; data: string }) => {
  return writeDataFile(fileName, data)
})

ipcMain.handle('store-remove', async (_e, fileName: string) => {
  return removeDataFile(fileName)
})

// Debug logging from renderer
ipcMain.handle('debug-log', async (_e, message: string, data?: any) => {
  console.log(`[Renderer] ${message}`, data ?? '')
  return true
})

ipcMain.handle('get-user-data-path', async () => {
  return app.getPath('userData')
})

ipcMain.handle('set-app-root-path', async (_e, rootPath: string) => {
  return writeDataFile('app-root.txt', rootPath)
})

ipcMain.handle('get-recommended-app-path', async () => {
  // Return a sensible default path for the app data
  const defaultPath = path.join(app.getPath('documents'), 'Arqchives')
  return defaultPath
})

// ── Backup ───────────────────────────────────────────────────────────────────────
ipcMain.handle('backup-export', async (_e, opts?: { includeConfig?: boolean; includeProjects?: boolean; includeAlbums?: boolean; includeFiles?: boolean; includeStore?: boolean }) => {
  const archiver = (await import('archiver')).default
  const backupPath = path.join(app.getPath('downloads'), `arqchives-backup-${Date.now()}.zip`)
  const output = fs.createWriteStream(backupPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  return new Promise<{ ok: boolean; filePath?: string; error?: string }>((resolve) => {
    output.on('close', () => resolve({ ok: true, filePath: backupPath }))
    archive.on('error', (err) => resolve({ ok: false, error: String(err) }))
    archive.pipe(output)

    if (opts?.includeConfig !== false) {
      const configPath = getDataPath('app-config.json')
      if (fs.existsSync(configPath)) archive.file(configPath, { name: 'app-config.json' })
    }
    if (opts?.includeStore !== false) {
      const storePath = getDataPath('arqchives-store')
      if (fs.existsSync(storePath)) archive.file(storePath, { name: 'arqchives-store' })
    }
    if (opts?.includeProjects !== false) {
      const root = readDataFile('app-root.txt')
      if (root && fs.existsSync(root)) archive.directory(root, 'projects')
    }
    if (opts?.includeAlbums !== false) {
      const albumsPath = getDataPath('albums.json')
      if (fs.existsSync(albumsPath)) archive.file(albumsPath, { name: 'albums.json' })
    }

    archive.finalize()
  })
})

ipcMain.handle('backup-import', async (_e, zipPath: string) => {
  const AdmZip = (await import('adm-zip')).default
  const fs = await import('fs')
  const path = await import('path')

  try {
    if (!fs.existsSync(zipPath)) {
      return { ok: false, error: 'Arquivo ZIP não encontrado' }
    }

    const zip = new AdmZip(zipPath)
    const zipEntries = zip.getEntries()
    let fileCount = 0

    // Extract to a temporary directory first
    const tempDir = path.join(app.getPath('temp'), `arqchives-restore-${Date.now()}`)
    fs.mkdirSync(tempDir, { recursive: true })
    zip.extractAllTo(tempDir, true)

    // 1. Restore app-config.json (project config)
    const configEntry = zipEntries.find(e => e.entryName === 'app-config.json')
    if (configEntry) {
      const configPath = getDataPath('app-config.json')
      fs.writeFileSync(configPath, configEntry.getData().toString('utf-8'))
      fileCount++
    }

    // 2. Restore arqchives-store (Zustand persist) - NOVO
    const storeEntry = zipEntries.find(e => e.entryName === 'arqchives-store')
    if (storeEntry) {
      const storePath = getDataPath('arqchives-store')
      fs.writeFileSync(storePath, storeEntry.getData().toString('utf-8'))
      fileCount++
    }

    // 3. Restore albums.json (legacy)
    const albumsEntry = zipEntries.find(e => e.entryName === 'albums.json')
    if (albumsEntry) {
      const albumsPath = getDataPath('albums.json')
      fs.writeFileSync(albumsPath, albumsEntry.getData().toString('utf-8'))
      fileCount++
    }

    // 4. Restore projects folder (if exists in zip)
    const projectsEntries = zipEntries.filter(e => e.entryName.startsWith('projects/'))
    if (projectsEntries.length > 0) {
      const root = readDataFile('app-root.txt')
      if (root && fs.existsSync(root)) {
        // Copy extracted projects to the app root
        const extractedProjectsPath = path.join(tempDir, 'projects')
        if (fs.existsSync(extractedProjectsPath)) {
          const copyRecursive = (src: string, dest: string) => {
            const entries = fs.readdirSync(src, { withFileTypes: true })
            fs.mkdirSync(dest, { recursive: true })
            for (const entry of entries) {
              const srcPath = path.join(src, entry.name)
              const destPath = path.join(dest, entry.name)
              if (entry.isDirectory()) {
                copyRecursive(srcPath, destPath)
              } else {
                fs.copyFileSync(srcPath, destPath)
                fileCount++
              }
            }
          }
          copyRecursive(extractedProjectsPath, root)
        }
      }
    }

    // Cleanup temp dir
    fs.rmSync(tempDir, { recursive: true, force: true })

    return { ok: true, fileCount }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
})

ipcMain.handle('config-export', async () => {
  const configPath = getDataPath('app-config.json')
  if (!fs.existsSync(configPath)) return { ok: false, error: 'Config não encontrada' }
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return { ok: true, config }
  } catch (err) { return { ok: false, error: String(err) } }
})

ipcMain.handle('config-import', async (_e, config: any) => {
  try {
    writeDataFile('app-config.json', JSON.stringify(config, null, 2))
    return { ok: true }
  } catch (err) { return { ok: false, error: String(err) } }
})

// ── Legacy Project APIs (for backward compatibility) ─────────────────────────────
ipcMain.handle('select-root-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Selecione a pasta raiz dos projetos',
  })
  if (!result.canceled && result.filePaths.length > 0) {
    writeDataFile('app-root.txt', result.filePaths[0])
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle('get-root-folder', () => readDataFile('app-root.txt'))

ipcMain.handle('list-projects', () => {
  const root = readDataFile('app-root.txt')
  if (!root || !fs.existsSync(root)) return []
  try {
    return fs.readdirSync(root, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort()
  } catch { return [] }
})

ipcMain.handle('create-project', async (_e, { name, rootFolder }: { name: string; rootFolder: string }) => {
  const projectPath = path.join(rootFolder, name)
  if (fs.existsSync(projectPath)) throw new Error('Projeto já existe')

  fs.mkdirSync(projectPath, { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'Tracks'), { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'Artwork'), { recursive: true })
  fs.mkdirSync(path.join(projectPath, 'Exports'), { recursive: true })

  const config = {
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tracks: [],
    albums: [],
  }
  fs.writeFileSync(path.join(projectPath, 'project.json'), JSON.stringify(config, null, 2))
  return { success: true, path: projectPath }
})

ipcMain.handle('read-project-config', (_e, projectPath: string) => {
  try {
    const configPath = path.join(projectPath, 'project.json')
    if (!fs.existsSync(configPath)) return null
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch { return null }
})

ipcMain.handle('write-project-config', (_e, { projectPath, config }: { projectPath: string; config: any }) => {
  try {
    const configPath = path.join(projectPath, 'project.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('read-file', (_e, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return null
    return fs.readFileSync(filePath, 'utf-8')
  } catch { return null }
})

ipcMain.handle('write-file', (_e, { filePath, content }: { filePath: string; content: string }) => {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content, 'utf-8')
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('copy-file-legacy', async (_e, { src, dest }: { src: string; dest: string }) => {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(src, dest)
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('move-file-legacy', async (_e, { src, dest }: { src: string; dest: string }) => {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.renameSync(src, dest)
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('delete-file-legacy', (_e, filePath: string) => {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('open-folder', async (_e, folderPath: string) => {
  try {
    await shell.openPath(folderPath)
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('open-external', async (_e, url: string) => {
  try {
    await shell.openExternal(url)
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('save-album', (_e, { projectPath, album }: { projectPath: string; album: any }) => {
  try {
    const configPath = path.join(projectPath, 'project.json')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    const idx = config.albums.findIndex((a: any) => a.id === album.id)
    if (idx >= 0) config.albums[idx] = album
    else config.albums.push(album)
    config.updatedAt = new Date().toISOString()
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('delete-album', (_e, { projectPath, albumId }: { projectPath: string; albumId: string }) => {
  try {
    const configPath = path.join(projectPath, 'project.json')
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    config.albums = config.albums.filter((a: any) => a.id !== albumId)
    config.updatedAt = new Date().toISOString()
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return { success: true }
  } catch (err) { return { success: false, error: String(err) } }
})

ipcMain.handle('export-project', async (_e, { projectPath, outputPath }: { projectPath: string; outputPath: string }) => {
  const archiver = (await import('archiver')).default
  const output = fs.createWriteStream(outputPath)
  const archive = archiver('zip', { zlib: { level: 9 } })

  return new Promise((resolve, reject) => {
    output.on('close', () => resolve({ success: true, size: archive.pointer() }))
    archive.on('error', (err) => reject({ success: false, error: String(err) }))
    archive.pipe(output)
    archive.directory(projectPath, false)
    archive.finalize()
  })
})