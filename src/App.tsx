import { useEffect, useState, useCallback } from 'react'
import { useAppStore, useActiveProject, useProjects, usePlaylistCurrentTrack, usePlaylistIsPlaying, usePlaylistQueue, usePlaylistCurrentIndex, usePlaylistRepeat, usePlaylistIsOpen, usePlayNext, useSetIsPlaying, useSetCurrentIndex, useSidebarWidth, useSidebarCollapsed, usePlaylistCollapsed, useSetSidebarWidth, useSetSidebarCollapsed, useShowConfig, useSetShowConfig } from '@/store/useAppStore'
import TitleBar from '@/components/layout/TitleBar'
import AppToolbar from '@/components/layout/AppToolbar'
import Sidebar from '@/components/layout/Sidebar'
import ProjectOverview from '@/components/project/ProjectOverview'
import SetupScreen from '@/components/setup/SetupScreen'
import { ProjectConfigModal } from '@/components/modals/ProjectConfigModal'
import { Plus, FolderOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { NewProjectModal } from '@/components/modals'
import { useFileOrganizer } from '@/hooks/useAlbumOperations'
import { AudioPlayer } from '@/components/player/AudioPlayer'
import { ResizablePanel } from '@/components/layout/ResizablePanel'

export default function App() {
  const { appRoot, isLoading, addProject, updateProject } = useAppStore()
  const activeProject = useActiveProject()
  const projects = useProjects()
  const [mounted, setMounted] = useState(false)
  const [showNewProject, setShowNewProject] = useState(false)
  const { organizeProjectFile } = useFileOrganizer()
  
  // Global audio player state
  const currentTrack = usePlaylistCurrentTrack()
  const isPlaying = usePlaylistIsPlaying()
  const queue = usePlaylistQueue()
  const currentIndex = usePlaylistCurrentIndex()
  const repeat = usePlaylistRepeat()
  const isPlaylistOpen = usePlaylistIsOpen()
  const playNext = usePlayNext()
  const setIsPlaying = useSetIsPlaying()
  const setCurrentIndex = useSetCurrentIndex()
  
  // Layout state
  const sidebarWidth = useSidebarWidth()
  const sidebarCollapsed = useSidebarCollapsed()
  const playlistCollapsed = usePlaylistCollapsed()
  const setSidebarWidth = useSetSidebarWidth()
  const setSidebarCollapsed = useSetSidebarCollapsed()
  
  // UI State
  const showConfig = useShowConfig()
  const setShowConfig = useSetShowConfig()
  
  const [audioSrc, setAudioSrc] = useState<string>('')
  const [showPlayer, setShowPlayer] = useState(false)

  // Memoized callbacks for AudioPlayer to prevent effect re-runs
  const handleAudioEnded = useCallback(() => {
    window.dispatchEvent(new CustomEvent('arqchives:audio-ended'))
  }, [])

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing)
  }, [setIsPlaying])

  // CSS variables for player positioning (updated on layout changes)
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--sidebar-width', sidebarCollapsed ? '0px' : `${sidebarWidth}px`)
    root.style.setProperty('--playlist-width', (isPlaylistOpen && !playlistCollapsed) ? '280px' : '0px')
  }, [sidebarCollapsed, sidebarWidth, isPlaylistOpen, playlistCollapsed])

  // Handle playlist play events
  useEffect(() => {
    const handlePlaylistPlay = async (e: Event) => {
      const ce = e as CustomEvent
      const { audioPath, index } = ce.detail
      if (audioPath) {
        // Convert file path to file:// URL if needed
        let finalAudioPath = audioPath
        if (!audioPath.startsWith('file://') && !audioPath.startsWith('blob:') && !audioPath.startsWith('http')) {
          const localUrl = await window.electronAPI?.getLocalUrl(audioPath)
          if (localUrl) finalAudioPath = localUrl
        }
        // Validate that finalAudioPath is a valid URL
        if (!finalAudioPath || !finalAudioPath.startsWith('file://') && !finalAudioPath.startsWith('blob:') && !finalAudioPath.startsWith('http') && !finalAudioPath.startsWith('data:')) {
          return
        }
        setAudioSrc(finalAudioPath)
        setShowPlayer(true)
        setCurrentIndex(index)
        setIsPlaying(true)
      }
    }
    
    window.addEventListener('arqchives:playlist-play', handlePlaylistPlay as unknown as EventListener)
    return () => window.removeEventListener('arqchives:playlist-play', handlePlaylistPlay as unknown as EventListener)
  }, [setCurrentIndex, setIsPlaying])

  // Auto-play next when current ends
  useEffect(() => {
    const handleEnded = () => {
      if (repeat === 'one') {
        // Replay current track
        setAudioSrc(currentTrack ? audioSrc : '')
        setIsPlaying(true)
      } else if (repeat === 'all' || currentIndex < queue.length - 1) {
        playNext()
      } else {
        setIsPlaying(false)
      }
    }
    
    window.addEventListener('arqchives:audio-ended', handleEnded)
    return () => window.removeEventListener('arqchives:audio-ended', handleEnded)
  }, [currentTrack, audioSrc, repeat, currentIndex, queue.length, playNext, setIsPlaying])

  // Watch for store changes (next/prev clicked in PlaylistPanel - handled by playlist-play event now)
  // useEffect removed - playlist-play event is the single source of truth

  useEffect(() => {
    setMounted(true)
    const handleNewProject = () => setShowNewProject(true)
    window.addEventListener('arqchives:new-project', handleNewProject)
    return () => window.removeEventListener('arqchives:new-project', handleNewProject)
  }, [])

  if (!mounted) return null

  // Se não houver pasta raiz configurada, mostra tela de setup
  if (!appRoot) {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <TitleBar />
        <main className="flex-1 overflow-hidden flex items-center justify-center p-8">
          <SetupScreen />
        </main>
      </div>
    )
  }

  // Empty state when no project is selected
  const NoProjectSelected = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full text-center p-8"
    >
      {/* Animated background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ backgroundColor: 'hsl(var(--primary))' }} />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-10 animate-pulse" 
          style={{ animationDelay: '1s', backgroundColor: 'hsl(var(--accent))' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto">
        {/* Icon with glow effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto relative"
            style={{ background: 'linear-gradient(135deg, hsl(var(--primary))/15 0%, hsl(var(--accent))/05 100%)', border: '1px solid hsl(var(--primary))/30' }}>
            <div className="absolute inset-0 rounded-3xl blur-xl opacity-30" style={{ backgroundColor: 'hsl(var(--primary))' }} />
            <Sparkles className="w-12 h-12 text-white" style={{ color: 'hsl(var(--primary))' }} />
          </div>
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-3xl border-2"
            style={{ borderColor: 'hsl(var(--primary))', transformOrigin: 'center' }} />
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">Nenhum projeto selecionado</h2>
          <p className="text-neutral-400 text-base leading-relaxed max-w-md">
            Selecione um projeto no menu lateral ou crie um novo para começar a organizar sua música.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <Button
            size="lg"
            className="w-full gap-2 group bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => {
              // Trigger new project creation in sidebar
              window.dispatchEvent(new CustomEvent('arqchives:new-project'))
            }}
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Criar Projeto</span>
          </Button>
          {projects.length > 0 && (
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2 group"
              onClick={() => {
                // Focus sidebar dropdown
                window.dispatchEvent(new CustomEvent('arqchives:focus-projects'))
              }}
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Ver Projetos</span>
            </Button>
          )}
        </motion.div>

        {/* Quick tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 pt-4 border-t border-neutral-800/50 w-full max-w-lg"
        >
          <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-3">O que são Projetos?</p>
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: '📁', label: 'Organização', desc: 'Cada projeto = uma pasta raiz' },
              { icon: '🎨', label: 'Personalização', desc: 'Cor, foto, gênero próprios' },
              { icon: '💿', label: 'Álbuns & Faixas', desc: 'Estrutura completa por projeto' },
              { icon: '⚙️', label: 'Configurações', desc: 'Tags, pastas, templates únicos' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-neutral-900/30 border border-neutral-800/50 hover:border-neutral-700/50 transition-colors group"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-medium text-white text-sm">{item.label}</p>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden relative">
      <TitleBar />
      <AppToolbar />
      
      {/* Main Layout Container - flex row: Sidebar | Main | Playlist */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Resizable (fixed left) */}
        <ResizablePanel
          position="left"
          width={sidebarWidth}
          minWidth={200}
          maxWidth={500}
          collapsed={sidebarCollapsed}
          onWidthChange={setSidebarWidth}
          onCollapseChange={setSidebarCollapsed}
          showCollapseButton={false}
          className="z-50"
        >
          <Sidebar />
        </ResizablePanel>

        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 overflow-hidden bg-neutral-950 transition-all duration-300",
            isLoading && "opacity-50 pointer-events-none"
          )}
          style={{ marginLeft: sidebarCollapsed ? 0 : sidebarWidth }}
        >
          {activeProject ? (
            <ProjectOverview project={activeProject} />
          ) : (
            <NoProjectSelected />
          )}
        </main>
      </div>

      {/* Overlay de Loading Global */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white font-medium">Processando...</p>
          </div>
        </div>
      )}

      {/* Global Audio Player - fixed at bottom of screen, OUTSIDE layout containers to prevent unmount on resize */}
      {showPlayer && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none" style={{
          marginLeft: 'var(--sidebar-width, 0px)',
          marginRight: 'var(--playlist-width, 0px)',
        }}>
          <div className="pointer-events-auto mx-auto max-w-full">
            <AudioPlayer
              src={audioSrc}
              onEnded={handleAudioEnded}
              isPlaying={isPlaying}
              onPlayStateChange={handlePlayStateChange}
            />
          </div>
        </div>
      )}

      {/* Project Config Modal - no nível do App para não ser clippado pelo Sidebar */}
      {showConfig && (
        <ProjectConfigModal onClose={() => setShowConfig(false)} />
      )}
      
      {showNewProject && (
        <NewProjectModal
          open={showNewProject}
          onClose={() => setShowNewProject(false)}
          onSubmit={async (data) => {
            // Create project first (with data URL for immediate preview)
            const newProject = addProject({ 
              name: data.name, 
              genre: data.genre, 
              photo: data.photo || '', 
              accent: data.accent || '#3b82f6' 
            })
            
            // If there's a photo file path, organize it into the project's Artwork folder with custom name
            if (data.photoFilePath && appRoot) {
              const organizedPath = await organizeProjectFile(data.photoFilePath, newProject.name, undefined, `Cover - ${newProject.name}`)
              // Update project with the organized file path
              updateProject(newProject.id, { photo: organizedPath })
            }
            
            useAppStore.getState().setActiveProject(newProject.id)
          }}
        />
      )}
    </div>
  )
}