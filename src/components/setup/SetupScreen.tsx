'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, HardDrive, Database, RotateCw, Check, ChevronRight, Plus } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useFileOperations } from '@/hooks/useElectron'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { AppIcon } from '@/components/ui/AppIcon'

type SetupStep = 'welcome' | 'new-options' | 'structure' | 'restore' | 'restore-options'
type NewOption = 'default' | 'custom'
type RestoreOption = 'folder' | 'zip'

export default function SetupScreen() {
  const { setAppRoot } = useAppStore()
  const { selectFolder, getRecommendedAppPath, setAppRootPath, selectFiles } = useFileOperations()
  const [step, setStep] = useState<SetupStep>('welcome')
  const [newOption, setNewOption] = useState<NewOption>('default')
  const [restoreOption, setRestoreOption] = useState<RestoreOption>('folder')
  const [useDefaultStructure, setUseDefaultStructure] = useState(true)
  const [recommendedPath, setRecommendedPath] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecommendedPath = async () => {
    const path = await getRecommendedAppPath()
    if (path) setRecommendedPath(path)
  }

  if (!recommendedPath) {
    loadRecommendedPath()
  }

  const handleDefaultPath = async () => {
    setNewOption('default')
    setStep('structure')
  }

  const handleCustomPath = async () => {
    setLoading(true)
    setError(null)
    const folder = await selectFolder()
    if (folder) {
      setNewOption('custom')
      setStep('structure')
      // Store the custom path temporarily
      ;(window as any).__mpmCustomPath = folder
    }
    setLoading(false)
  }

  const handleCreateStructure = async () => {
    setLoading(true)
    setError(null)
    try {
      let targetPath: string
      if (newOption === 'default') {
        targetPath = recommendedPath
      } else {
        targetPath = (window as any).__mpmCustomPath
        if (!targetPath) {
          const folder = await selectFolder()
          if (!folder) { setLoading(false); return }
          targetPath = folder
        }
      }
      // Create the folder
      await window.electronAPI?.ensureFolder(targetPath)
      if (useDefaultStructure) {
        // Create default structure
        const structure = [
          'albums',
          'singles',
          'eps',
          'references',
          'contracts',
          'press',
          'social',
          'material',
        ]
        await Promise.all(structure.map(f => window.electronAPI?.ensureFolder(`${targetPath}\\${f}`)))
      }
      setAppRoot(targetPath)
      await setAppRootPath(targetPath)
    } catch (e: any) {
      setError(e.message || 'Erro ao criar pasta')
    }
    setLoading(false)
  }

  const handleRestore = async () => {
    setLoading(true)
    setError(null)
    const folder = await selectFolder()
    if (folder) {
      // Basic validation - check if it has Arqchives structure
      const entries = await window.electronAPI?.listFiles(folder)
      const hasAlbums = entries?.some(e => e.isDirectory && e.name.toLowerCase() === 'albums')
      const hasProjects = entries?.some(e => e.isDirectory)
      if (hasAlbums || hasProjects) {
        setAppRoot(folder)
        await setAppRootPath(folder)
      } else {
        setError('Pasta não parece ser um backup válido do Arqchives')
      }
    }
    setLoading(false)
  }

  const handleRestoreZip = async (zipPath: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await window.electronAPI?.backupImport(zipPath)
      if (result?.ok) {
        // After import, we need to reload the app state
        // The backupImport handler already restores the store, so we just need to reload
        window.location.reload()
      } else {
        setError(result?.error || 'Erro ao restaurar backup')
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao restaurar backup')
    }
    setLoading(false)
  }

  const backToWelcome = () => {
    setStep('welcome')
    setNewOption('default')
    setRestoreOption('folder')
    setUseDefaultStructure(true)
    setError(null)
  }

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6"
      >
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-transparent"
          >
            <AppIcon size={64} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-2"
          >
            Bem-vindo ao Arqchives
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-sm mb-8"
          >
            Organize seus projetos musicais com estrutura profissional.
          </motion.p>

          {/* Two main options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <motion.button
              onClick={() => setStep('new-options')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl border bg-neutral-900/50 border-white/10 hover:border-white/20 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Novo Workspace</h3>
                  <p className="text-neutral-500 text-sm">Criar pasta limpa com estrutura opcional</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => setStep('restore-options')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 rounded-xl border bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <RotateCw className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Recuperar Backup</h3>
                  <p className="text-neutral-500 text-sm">Selecionar pasta existente do Arqchives</p>
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-500" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // New Workspace Options
  if (step === 'new-options') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6"
      >
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={backToWelcome}
            className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-xl font-bold text-white">Novo Workspace</h2>
            <p className="text-neutral-400 text-sm mt-1">Onde deseja criar a pasta?</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {/* Default folder option */}
            <button
              onClick={handleDefaultPath}
              disabled={loading}
              className={cn(
                'w-full p-4 rounded-xl border bg-neutral-900/50 transition-all text-left',
                newOption === 'default'
                  ? 'border-emerald-400/50 bg-emerald-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  newOption === 'default' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                )}>
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="font-medium text-white truncate">Pasta Padrão do Sistema</h3>
                  <p className="text-neutral-500 text-sm truncate">{recommendedPath || 'Carregando...'}</p>
                </div>
                {newOption === 'default' && <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              </div>
            </button>

            {/* Custom folder option */}
            <button
              onClick={handleCustomPath}
              disabled={loading}
              className={cn(
                'w-full p-4 rounded-xl border bg-neutral-900/50 transition-all text-left',
                newOption === 'custom'
                  ? 'border-blue-400/50 bg-blue-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  newOption === 'custom' ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-500'
                )}>
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white">Selecionar Pasta Personalizada</h3>
                  <p className="text-neutral-500 text-sm">Escolha qualquer local (outro HD, pasta específica, etc.)</p>
                </div>
                {newOption === 'custom' && <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />}
              </div>
            </button>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    )
  }

  // Structure Options
  if (step === 'structure') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6"
      >
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep('new-options')}
            className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-xl font-bold text-white">Estrutura de Pastas</h2>
            <p className="text-neutral-400 text-sm mt-1">
              {newOption === 'default' ? 'Pasta padrão do sistema' : 'Pasta personalizada selecionada'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Toggle for default structure */}
            <div className="p-4 rounded-xl border bg-neutral-900/50 border-neutral-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                    useDefaultStructure ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                  )}>
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Criar estrutura padrão</h3>
                    <p className="text-neutral-500 text-sm">Albums, Singles, EPs, References, Contracts, Press, Social, Material</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseDefaultStructure(!useDefaultStructure)}
                  className={cn(
                    'w-11 h-6 rounded-full flex items-center transition-all flex-shrink-0',
                    useDefaultStructure ? 'bg-emerald-500 justify-end pr-2' : 'bg-neutral-700 justify-start pl-2'
                  )}
                >
                  <div className="w-4 h-4 bg-white rounded-full" />
                </button>
              </label>

              {useDefaultStructure && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-neutral-800 space-y-2 text-xs text-neutral-400"
                >
                  {[
                    '📁 albums/ — Álbuns completos',
                    '📁 singles/ — Músicas avulsas',
                    '📁 eps/ — EPs',
                    '📁 references/ — Referências sonoras',
                    '📁 contracts/ — Contratos',
                    '📁 press/ — Press kit',
                    '📁 social/ — Assets para redes sociais',
                    '📁 material/ — Material extra',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Create button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleCreateStructure}
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Workspace'}
            </Button>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Restore Options - Choose folder or ZIP
  if (step === 'restore-options') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6"
      >
        <div className="w-full max-w-md">
          <button
            onClick={backToWelcome}
            className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h2 className="text-xl font-bold text-white">Recuperar Backup</h2>
            <p className="text-neutral-400 text-sm mt-1">Como deseja restaurar?</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {/* Folder option */}
            <button
              onClick={() => { setRestoreOption('folder'); setStep('restore'); }}
              disabled={loading}
              className={cn(
                'w-full p-4 rounded-xl border bg-neutral-900/50 transition-all text-left',
                restoreOption === 'folder'
                  ? 'border-amber-400/50 bg-amber-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  restoreOption === 'folder' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-500'
                )}>
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white">Selecionar Pasta Existente</h3>
                  <p className="text-neutral-500 text-sm">Pasta de workspace criada anteriormente pelo Arqchives</p>
                </div>
                {restoreOption === 'folder' && <Check className="w-5 h-5 text-amber-400 flex-shrink-0" />}
              </div>
            </button>

            {/* ZIP file option */}
            <button
              onClick={async () => {
                setRestoreOption('zip')
                const result = await selectFiles({
                  title: 'Selecionar arquivo de backup ZIP',
                  filters: [{ name: 'Arqchives Backup', extensions: ['zip'] }],
                  multiple: false,
                })
                if (result?.[0]) {
                  await handleRestoreZip(result[0])
                }
              }}
              disabled={loading}
              className={cn(
                'w-full p-4 rounded-xl border bg-neutral-900/50 transition-all text-left',
                restoreOption === 'zip'
                  ? 'border-blue-400/50 bg-blue-500/10'
                  : 'border-neutral-800 hover:border-neutral-700'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  restoreOption === 'zip' ? 'bg-blue-500/20 text-blue-400' : 'bg-neutral-800 text-neutral-500'
                )}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white">Restaurar de Arquivo ZIP</h3>
                  <p className="text-neutral-500 text-sm">Arquivo de backup exportado pelo Arqchives (.zip)</p>
                </div>
                {restoreOption === 'zip' && <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />}
              </div>
            </button>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    )
  }

  // Restore Backup from Folder
  if (step === 'restore') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6"
      >
        <div className="w-full max-w-md text-center">
          <button
            onClick={backToWelcome}
            className="mb-6 flex items-center gap-2 text-neutral-400 hover:text-white text-sm justify-start"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Voltar
          </button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)' }}
          >
            <Database className="w-8 h-8 text-black" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-white mb-2"
          >
            Recuperar Backup
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-sm mb-6"
          >
            Selecione uma pasta criada anteriormente pelo Arqchives.<br />
            Deve conter a estrutura de álbuns e projetos.
          </motion.p>

          <motion.button
            onClick={handleRestore}
            disabled={loading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-xl border bg-neutral-900/50 border-amber-400/50 bg-amber-500/10 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white">Selecionar Pasta de Backup</h3>
                <p className="text-neutral-500 text-sm">O app validará a estrutura automaticamente</p>
              </div>
              {loading && <div className="w-5 h-5 border-2 border-amber-400/50 border-t-amber-400 rounded-full animate-spin" />}
            </div>
          </motion.button>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-red-400 text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-neutral-500 text-xs text-center"
          >
            A pasta deve ter sido criada por este app (Arqchives v2+)
          </motion.p>
        </div>
      </motion.div>
    )
  }

  return null
}