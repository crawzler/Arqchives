import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.resolve()
const isDev = !app.isPackaged

// Disable GPU acceleration to fix black screen
app.disableHardwareAcceleration()
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-software-rasterizer')

// ── Persistência em arquivo (userData) ───────────────────────────────────────
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

// Migra dados do userData de dev (archives-app) para o build (Arqchives)
function migrateFromDev() {
  const devDataPath = path.join(path.dirname(app.getPath('userData')), 'archives-app')
  if (!fs.existsSync(devDataPath)) return

  const filesToMigrate = ['albums.json', 'app-root.txt', 'project-config.json']
  for (const fileName of filesToMigrate) {
    const dest = getDataPath(fileName)
    if (fs.existsSync(dest)) continue
    const src = path.join(devDataPath, fileName)
    if (!fs.existsSync(src)) continue
    try {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
    } catch (e) {
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
      preload: path.join(__dirname, 'electron/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
    },
    icon: isDev 
      ? path.join(process.cwd(), 'public', 'icon.ico')
      : path.join(__dirname, '..', 'dist', 'icon.ico'),
  })

  if (isDev) {
    // Poll Vite dev server until ready (handles dynamic port)
    const tryLoad = async (attempt = 0) => {
      const ports = [50000, 50001, 50002, 50003, 50004, 50005, 50006, 50007, 50008, 50009, 50010]
      for (const port of ports) {
        try {
          const res = await fetch(`http://localhost:${port}/`).catch(() => null)
          if (res?.ok) {
            const text = await res.text()
            // Verify it's Vite dev server (has module script or vite marker)
            const isVite = text.includes('vite') || text.includes('src/main.tsx') || text.includes('type="module"')
            if (isVite) {
              win.loadURL(`http://localhost:${port}`)
              return
            }
          }
        } catch (e) {
        }
      }
      if (attempt < 30) {
        setTimeout(() => tryLoad(attempt + 1), 500)
      } else {
        win.loadURL('http://localhost:50001') // fallback
      }
    }
    tryLoad()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
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

  win.webContents.on('will-navigate', (e, url) => {
    if (url.startsWith('file://')) e.preventDefault()
  })
}

// Protocolo não é mais necessário — usando base64 via IPC
app.whenReady().then(() => {
  migrateFromDev()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ── Pasta ────────────────────────────────────────────────────────────────────

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled) return null
  return result.filePaths[0]
})

ipcMain.handle('select-dest-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Selecionar pasta destino',
  })
  if (result.canceled) return null
  return result.filePaths[0]
})

ipcMain.handle('select-files', async (_, opts: { title?: string; filters?: Electron.FileFilter[]; multiple?: boolean } = {}) => {
  const properties: Array<'openFile' | 'multiSelections'> = ['openFile']
  if (opts.multiple) properties.push('multiSelections')
  const result = await dialog.showOpenDialog({
    title: opts.title || 'Selecionar arquivo',
    filters: opts.filters || [],
    properties,
  })
  if (result.canceled) return null
  return result.filePaths
})

// ── Listar arquivos ───────────────────────────────────────────────────────────

ipcMain.handle('list-files', async (_, folderPath: string) => {
  if (!folderPath || !fs.existsSync(folderPath)) return []
  try {
    const entries = await fs.promises.readdir(folderPath, { withFileTypes: true })
    const items = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(folderPath, entry.name)
      let size = 0
      try {
        if (!entry.isDirectory()) {
          const stat = await fs.promises.stat(fullPath)
          size = stat.size
        }
      } catch {}
      return {
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: fullPath,
        ext: path.extname(entry.name).toLowerCase(),
        size,
      }
    }))
    return items
  } catch {
    return []
  }
})

ipcMain.handle('list-files-recursive', async (_, folderPath: string) => {
  if (!folderPath || !fs.existsSync(folderPath)) return []

  const results: any[] = []

  async function walk(dir: string) {
    let entries
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    const dirs: string[] = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        dirs.push(fullPath)
      } else {
        let size = 0
        try {
          const stat = await fs.promises.stat(fullPath)
          size = stat.size
        } catch {}
        results.push({
          name: entry.name,
          isDirectory: false,
          path: fullPath,
          ext: path.extname(entry.name).toLowerCase(),
          size,
          relativePath: path.relative(folderPath, fullPath),
        })
      }
    }

    const CONCURRENCY = 8
    for (let i = 0; i < dirs.length; i += CONCURRENCY) {
      await Promise.all(dirs.slice(i, i + CONCURRENCY).map(walk))
    }
  }

  await walk(folderPath)
  return results
})

ipcMain.handle('file-exists', async (_, filePath: string) => {
  if (!filePath) return false
  return fs.existsSync(filePath)
})

ipcMain.on('drag-out-file', (event, filePath: string) => {
  if (!filePath || !fs.existsSync(filePath)) return

  const candidateIcons = isDev
    ? [
        path.join(__dirname, '../public/icon.png'),
        path.join(__dirname, '../public/icons.svg'),
      ]
    : [
        path.join(process.resourcesPath, 'icon.ico'),
        path.join(process.resourcesPath, 'icon.png'),
        path.join(__dirname, '../dist/icon.png'),
        path.join(__dirname, '../public/icon.png'),
      ]

  const iconPath = candidateIcons.find(p => fs.existsSync(p))
  if (!iconPath) {
    return
  }

  try {
    event.sender.startDrag({ file: filePath, icon: iconPath })
  } catch (err) {
  }
})

// ── Abrir / revelar ───────────────────────────────────────────────────────────

ipcMain.handle('open-file', async (_, filePath: string) => {
  shell.openPath(filePath)
})

ipcMain.handle('reveal-file', async (_, filePath: string) => {
  shell.showItemInFolder(filePath)
})

// ── Operações de arquivo ──────────────────────────────────────────────────────

ipcMain.handle('rename-file', async (_, oldPath: string, newName: string) => {
  try {
    const dir = path.dirname(oldPath)
    const newPath = path.join(dir, newName)
    if (fs.existsSync(newPath)) return { ok: false, error: 'Já existe um arquivo com esse nome.' }
    fs.renameSync(oldPath, newPath)
    return { ok: true, newPath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('delete-file', async (_, filePath: string) => {
  try {
    if (!filePath) return { ok: false, error: 'Path não informado.' }
    if (!fs.existsSync(filePath)) return { ok: true }

    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true })
    } else {
      fs.unlinkSync(filePath)
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('move-file', async (_, filePath: string, destFolder: string) => {
  try {
    const name = path.basename(filePath)
    let destPath = path.join(destFolder, name)
    let counter = 1
    while (fs.existsSync(destPath)) {
      const ext = path.extname(name)
      const base = path.basename(name, ext)
      destPath = path.join(destFolder, `${base} (${counter})${ext}`)
      counter++
    }
    fs.renameSync(filePath, destPath)
    return { ok: true, newPath: destPath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('copy-file', async (_, filePath: string, destFolder: string) => {
  try {
    const name = path.basename(filePath)
    let destPath = path.join(destFolder, name)
    let counter = 1
    while (fs.existsSync(destPath)) {
      const ext = path.extname(name)
      const base = path.basename(name, ext)
      destPath = path.join(destFolder, `${base} (${counter})${ext}`)
      counter++
    }
    fs.copyFileSync(filePath, destPath)
    return { ok: true, newPath: destPath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('create-folder', async (_, parentPath: string, folderName: string) => {
  try {
    const newPath = path.join(parentPath, folderName)
    if (fs.existsSync(newPath)) return { ok: false, error: 'Pasta já existe.' }
    fs.mkdirSync(newPath)
    return { ok: true, newPath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('ensure-folder', async (_, dirPath: string) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('move-or-copy-file', async (_, opts: { srcPath: string; destFolder: string; fileName?: string; mode: 'move' | 'copy' }) => {
  const { srcPath, destFolder, fileName, mode } = opts
  try {
    if (!fs.existsSync(srcPath)) return { ok: false, error: 'Arquivo de origem não encontrado.' }

    fs.mkdirSync(destFolder, { recursive: true })

    const name = fileName || path.basename(srcPath)
    let destPath = path.join(destFolder, name)

    let counter = 1
    while (fs.existsSync(destPath)) {
      if (path.resolve(srcPath) === path.resolve(destPath)) {
        return { ok: true, newPath: destPath }
      }
      const ext = path.extname(name)
      const base = path.basename(name, ext)
      destPath = path.join(destFolder, `${base} (${counter})${ext}`)
      counter++
    }

    if (mode === 'copy') {
      fs.copyFileSync(srcPath, destPath)
    } else {
      try {
        fs.renameSync(srcPath, destPath)
      } catch (renameErr: any) {
        if (renameErr.code === 'EXDEV') {
          fs.copyFileSync(srcPath, destPath)
          fs.unlinkSync(srcPath)
        } else {
          throw renameErr
        }
      }
    }

    return { ok: true, newPath: destPath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

// Lê arquivo e retorna como data URL base64
ipcMain.handle('get-local-url', async (_, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) return null
    const ext = path.extname(filePath).toLowerCase()

    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.gif': 'image/gif',
      '.webp': 'image/webp', '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp', '.tiff': 'image/tiff',
      '.mp4': 'video/mp4', '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo', '.mkv': 'video/x-matroska',
      '.webm': 'video/webm', '.wmv': 'video/x-ms-wmv',
      '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
      '.flac': 'audio/flac', '.aiff': 'audio/aiff',
      '.ogg': 'audio/ogg', '.m4a': 'audio/mp4',
      '.aac': 'audio/aac', '.wma': 'audio/x-ms-wma',
    }

    const mime = mimeMap[ext]
    if (!mime) return null

    if (mime.startsWith('video/') || mime.startsWith('audio/')) {
      // Windows: file:///C:/path/to/file - precisa do slash inicial
      const normalized = filePath.replace(/\\/g, '/')
      const withLeadingSlash = normalized.startsWith('/') ? normalized : '/' + normalized
      return `file://${withLeadingSlash}`
    }

    const stat = await fs.promises.stat(filePath)
    if (stat.size > 10 * 1024 * 1024) return null

    const buffer = await fs.promises.readFile(filePath)
    return `data:${mime};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
})

// ── Audio Metadata ──────────────────────────────────────────────────────────
// Get audio file duration and metadata
ipcMain.handle('get-audio-metadata', async (_, filePath: string) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return { duration: null, size: 0 }
    
    // Get file size
    const stat = await fs.promises.stat(filePath)
    const size = stat.size
    
    // Try to get duration using music-metadata
    let duration: number | null = null
    
    try {
      const mm = await import('music-metadata')
      const metadata = await mm.parseFile(filePath, { duration: true, skipCovers: true })
      duration = metadata.format.duration || null
    } catch {
      // music-metadata not available
    }
    
    return { duration, size }
  } catch (e: any) {
    return { duration: null, size: 0 }
  }
})

// Read audio file as ArrayBuffer for waveform generation
ipcMain.handle('read-audio-file', async (_, filePath: string) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) return null
    const buffer = await fs.promises.readFile(filePath)
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  } catch (e: any) {
    return null
  }
})

// ── Controles da janela ───────────────────────────────────────────────────────

ipcMain.on('window-minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (win?.isMaximized()) win.unmaximize()
  else win?.maximize()
})
ipcMain.on('window-close', () => BrowserWindow.getFocusedWindow()?.close())

// ── Store IPC ─────────────────────────────────────────────────────────────────

ipcMain.handle('store-read', (_, fileName: string) => {
  const result = readDataFile(fileName)
  return result
})

ipcMain.handle('store-write', (_, fileName: string, data: string) => writeDataFile(fileName, data))

// Write appRoot to app-root.txt for backup compatibility
ipcMain.handle('set-app-root', (_, path: string) => {
  const ok = writeDataFile('app-root.txt', path)
  return ok
})

ipcMain.handle('get-user-data-path', () => app.getPath('userData'))

ipcMain.handle('get-recommended-app-path', () => {
  // Pasta recomendada: userData/Arqchives (pasta limpa só do app)
  return path.join(app.getPath('userData'), 'Arqchives')
})

// ── Backup IPC (ZIP real com arquivos) ────────────────────────────────────────────

function collectAllFilePaths(data: any): string[] {
  const files: string[] = []
  
  // Collect from albums
  if (data.albums) {
    Object.values(data.albums).forEach((projectAlbums: any) => {
      if (Array.isArray(projectAlbums)) {
        projectAlbums.forEach((album: any) => {
          if (album.coverPath) files.push(album.coverPath)
          if (album.files) album.files.forEach((f: string) => files.push(f))
          if (album.tracks) {
            album.tracks.forEach((track: any) => {
              if (track.files) track.files.forEach((f: string) => files.push(f))
              if (track.audioVersions) {
                track.audioVersions.forEach((v: any) => v.path && files.push(v.path))
              }
            })
          }
        })
      }
    })
  }
  
  return Array.from(new Set(files.filter(f => f && fs.existsSync(f))))
}

ipcMain.handle('backup-export', async (_, opts: { 
  includeConfig?: boolean; 
  includeProjects?: boolean; 
  includeAlbums?: boolean; 
  includeFiles?: boolean 
} = {}) => {
  const tempDir = fs.mkdtempSync(path.join(app.getPath('temp'), 'arqchives-backup-'))
  
  try {
    
    const { 
      includeConfig = true, 
      includeProjects = true, 
      includeAlbums = true, 
      includeFiles = true 
    } = opts
    
    const backup: any = {
      version: 2,
      exportedAt: Date.now(),
      appName: 'Arqchives',
      hasFiles: includeFiles,
    }
    
    // Read from arqchives-store (single source of truth for all app state)
    const storeData = readDataFile('arqchives-store')
    let storeState: any = {}
    if (storeData) {
      try {
        storeState = JSON.parse(storeData)
      } catch (e) {
      }
    }
    
    // Extract state from Zustand persist format: { state: {...}, version: N }
    const state = storeState.state || storeState
    
    if (includeConfig) {
      backup.appRoot = state.appRoot || readDataFile('app-root.txt')
      backup.projectConfig = state.projectConfig || JSON.parse(readDataFile('project-config.json') || '{}')
    }
    if (includeProjects) {
      backup.projects = state.projects || []
    }
    if (includeAlbums) {
      backup.albums = state.albums || {}
    }
    
    // Also write individual JSON files for backward compatibility during import
    if (backup.appRoot) fs.writeFileSync(path.join(tempDir, 'app-root.txt'), backup.appRoot, 'utf-8')
    if (backup.projectConfig) fs.writeFileSync(path.join(tempDir, 'project-config.json'), JSON.stringify(backup.projectConfig, null, 2), 'utf-8')
    if (backup.projects) fs.writeFileSync(path.join(tempDir, 'projects.json'), JSON.stringify(backup.projects, null, 2), 'utf-8')
    if (backup.albums) fs.writeFileSync(path.join(tempDir, 'albums.json'), JSON.stringify(backup.albums, null, 2), 'utf-8')
    
    // Write metadata.json to temp
    fs.writeFileSync(path.join(tempDir, 'metadata.json'), JSON.stringify(backup, null, 2), 'utf-8')
    
    // Create ZIP - show dialog FIRST, then copy files and zip
    const defaultPath = path.join(app.getPath('downloads'), `Arqchives-Backup-${new Date().toISOString().split('T')[0]}.zip`)
    const result = await dialog.showSaveDialog({
      title: 'Exportar Backup Completo (com arquivos)',
      defaultPath,
      filters: [{ name: 'ZIP Backup', extensions: ['zip'] }]
    })
    
    if (result.canceled) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      return { ok: false, canceled: true }
    }

    // Copy files AFTER user picks location (if includeFiles)
    let copiedFiles = 0
    if (includeFiles) {
      const filePaths = collectAllFilePaths(backup)
      const filesDir = path.join(tempDir, 'files')
      fs.mkdirSync(filesDir, { recursive: true })
      
      for (const srcPath of filePaths) {
        try {
          let relPath = srcPath
          if (backup.appRoot && srcPath.startsWith(backup.appRoot)) {
            relPath = path.relative(backup.appRoot, srcPath)
          } else {
            const hash = require('crypto').createHash('md5').update(srcPath).digest('hex').slice(0, 8)
            const ext = path.extname(srcPath)
            relPath = `external/${hash}${ext}`
          }
          
          const destPath = path.join(filesDir, relPath)
          fs.mkdirSync(path.dirname(destPath), { recursive: true })
          fs.copyFileSync(srcPath, destPath)
          copiedFiles++
        } catch (e) {
        }
      }
      backup.fileCount = copiedFiles
      fs.writeFileSync(path.join(tempDir, 'metadata.json'), JSON.stringify(backup, null, 2), 'utf-8')
    }
    
    // Create ZIP from tempDir using archiver (streaming, low memory) - dynamic import to avoid bundling
    // Use dynamic import with IIFE to prevent esbuild static analysis
    const Archiver = (await (async () => {
      const mod = await import('archiver')
      return mod.Archiver || mod.default?.Archiver || mod.default
    })())
    if (!Archiver) {
      throw new Error('Archiver class not found in archiver module')
    }
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(result.filePath)
      const archive = new Archiver('zip', { zlib: { level: 6 } })
      
      archive.on('error', (err: Error) => {
        reject(err)
      })
      output.on('close', () => {
        resolve()
      })
      output.on('error', (err: Error) => {
        reject(err)
      })
      
      archive.pipe(output)
      archive.directory(tempDir, false)
      archive.finalize()
    })
    
    // Cleanup temp
    fs.rmSync(tempDir, { recursive: true, force: true })
    
    return { ok: true, path: result.filePath, fileCount: copiedFiles }
  } catch (e: any) {
    fs.rmSync(tempDir, { recursive: true, force: true })
    return { ok: false, error: e.message || String(e) }
  }
})

ipcMain.handle('backup-import', async (_, zipPath: string) => {
  const tempDir = fs.mkdtempSync(path.join(app.getPath('temp'), 'arqchives-restore-'))
  
  try {
    if (!zipPath || !fs.existsSync(zipPath)) {
      return { ok: false, error: 'Arquivo ZIP não encontrado.' }
    }
    
    // Extract ZIP
    await new Promise<void>((resolve, reject) => {
      const AdmZip = require('adm-zip')
      try {
        const zip = new AdmZip(zipPath)
        zip.extractAllTo(tempDir, true)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    
    // Read metadata
    const metadataPath = path.join(tempDir, 'metadata.json')
    if (!fs.existsSync(metadataPath)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
      return { ok: false, error: 'Backup inválido: metadata.json não encontrado.' }
    }
    
    const backup = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
    if (!backup || backup.appName !== 'Arqchives') {
      fs.rmSync(tempDir, { recursive: true, force: true })
      return { ok: false, error: 'Arquivo de backup inválido.' }
    }
    
    // Restore JSON data
    if (backup.appRoot) writeDataFile('app-root.txt', backup.appRoot)
    if (backup.projectConfig) writeDataFile('project-config.json', JSON.stringify(backup.projectConfig))
    if (backup.projects) writeDataFile('projects.json', JSON.stringify(backup.projects))
    if (backup.albums) writeDataFile('albums.json', JSON.stringify(backup.albums))
    
    // Also restore to arqchives-store (Zustand persist format) for immediate app state sync
    const existingStore = readDataFile('arqchives-store')
    let existingState: any = {}
    if (existingStore) {
      try {
        existingState = JSON.parse(existingStore)
      } catch {}
    }
    const restoredStore = {
      state: {
        ...(existingState.state || existingState),
        ...(backup.appRoot && { appRoot: backup.appRoot }),
        ...(backup.projectConfig && { projectConfig: backup.projectConfig }),
        ...(backup.projects && { projects: backup.projects }),
        ...(backup.albums && { albums: backup.albums }),
      },
      version: existingState.version || 2,
    }
    writeDataFile('arqchives-store', JSON.stringify(restoredStore))

    // Restore files if present
    let restoredFiles = 0
    if (backup.hasFiles) {
      const filesDir = path.join(tempDir, 'files')
      if (fs.existsSync(filesDir)) {
        // Walk files dir and copy to original locations
        const walkAndCopy = async (dir: string, baseDir: string) => {
          const entries = await fs.promises.readdir(dir, { withFileTypes: true })
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            if (entry.isDirectory()) {
              await walkAndCopy(fullPath, baseDir)
            } else {
              const relPath = path.relative(baseDir, fullPath)
              // Try to restore to original location if under appRoot
              let destPath: string
              if (backup.appRoot && !relPath.startsWith('external/')) {
                destPath = path.join(backup.appRoot, relPath)
              } else if (relPath.startsWith('external/')) {
                // For external files, restore to appRoot/files/external/...
                destPath = path.join(backup.appRoot || app.getPath('userData'), 'Arqchives', 'restored', relPath)
              } else {
                destPath = path.join(backup.appRoot || app.getPath('userData'), 'Arqchives', 'restored', relPath)
              }
              
              try {
                fs.mkdirSync(path.dirname(destPath), { recursive: true })
                fs.copyFileSync(fullPath, destPath)
                restoredFiles++
              } catch (e) {
              }
            }
          }
        }
        await walkAndCopy(filesDir, filesDir)
      }
    }
    
    fs.rmSync(tempDir, { recursive: true, force: true })
    return { ok: true, fileCount: restoredFiles }
  } catch (e: any) {
    fs.rmSync(tempDir, { recursive: true, force: true })
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('config-export', async () => {
  try {
    const config = readDataFile('project-config.json')
    if (!config) return { ok: false, error: 'Nenhuma configuração encontrada.' }
    
    const backup = {
      version: 2,
      exportedAt: Date.now(),
      appName: 'Arqchives',
      type: 'config-only',
      projectConfig: JSON.parse(config),
    }
    
    const defaultPath = path.join(app.getPath('downloads'), `Arqchives-Config-${new Date().toISOString().split('T')[0]}.json`)
    const result = await dialog.showSaveDialog({
      title: 'Exportar Configurações',
      defaultPath,
      filters: [{ name: 'JSON Config', extensions: ['json'] }]
    })
    
    if (result.canceled) return { ok: false, canceled: true }
    
    fs.writeFileSync(result.filePath, JSON.stringify(backup, null, 2), 'utf-8')
    return { ok: true, path: result.filePath }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})

ipcMain.handle('config-import', async (_, config: any) => {
  try {
    if (!config || !config.projectConfig) {
      return { ok: false, error: 'Arquivo de configuração inválido.' }
    }
    writeDataFile('project-config.json', JSON.stringify(config.projectConfig))
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message }
  }
})