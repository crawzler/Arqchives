import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Edit2, X, Plus, Trash2, FolderOpen, RotateCw, FileText, ClipboardList, Type, AlertTriangle, ChevronRight, Save, Settings, FolderMinus, FolderPlus, Shield, ArrowUpDown, Eye, Tag as TagIcon, Download, Upload, Database, HardDrive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { DEFAULT_PROJECT_CONFIG, ProjectConfig, Tag } from '@/types'
import { useAppStore } from '@/store/useAppStore'
import { TooltipProvider } from '@/components/ui/Tooltip'

interface ProjectConfigModalProps {
  onClose: () => void
}

export function ProjectConfigModal({ onClose }: ProjectConfigModalProps) {
  const projectConfig = useAppStore(state => state.projectConfig)
  const [config, setConfig] = useState<ProjectConfig>(DEFAULT_PROJECT_CONFIG)
  const [activeTab, setActiveTab] = useState<'structure' | 'tags' | 'naming' | 'todos' | 'backup'>('structure')
  const [dirty, setDirty] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [resetMode, setResetMode] = useState<'config' | 'all' | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    projectFolders: true,
    albumFolders: true,
    trackFolders: true,
    folderTags: true,
    nameTemplates: true,
    tagsManager: true,
    naming: true,
    albumTodos: true,
    trackTodos: true,
    todoVisibility: true,
  })
  const resetApp = useAppStore(state => state.resetApp)

  // Carrega a config atual do projeto ao abrir o modal
  useEffect(() => {
    setConfig(JSON.parse(JSON.stringify(projectConfig)))
    setDirty(false)
  }, [projectConfig])

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const keys = path.split('.')
      const next = JSON.parse(JSON.stringify(prev))
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }
      const lastKey = keys[keys.length - 1]
      if (value === '__DELETE__') {
        delete obj[lastKey]
      } else {
        obj[lastKey] = value
      }
      return next
    })
    setDirty(true)
  }

  const handleSave = () => {
    // Garante que salvamos uma cópia limpa para evitar problemas de referência
    useAppStore.getState().updateProjectConfig(JSON.parse(JSON.stringify(config)))
    setDirty(false)
    onClose()
  }

  const handleReset = () => {
    setConfig(DEFAULT_PROJECT_CONFIG)
    setDirty(true)
  }

  const handleResetApp = () => {
    if (resetMode === 'config') {
      setConfig(DEFAULT_PROJECT_CONFIG)
      setDirty(true)
    } else if (resetMode === 'all') {
      resetApp()
      onClose()
      return
    }
    setShowResetConfirm(false)
    setResetMode(null)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const tabs = [
    { id: 'structure', label: 'Estrutura & Pastas', icon: FolderOpen },
    { id: 'tags', label: 'Tags & Extensões', icon: TagIcon },
    { id: 'naming', label: 'Padrões', icon: Type },
    { id: 'todos', label: 'Tarefas', icon: ClipboardList },
    { id: 'backup', label: 'Backup', icon: Database },
  ] as const

  const sortedItems = (items: string[]) => [...items].sort((a, b) => a.localeCompare(b))

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm pad-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-elevated border border-default radius-xl shadow-elev-5 w-full max-w-2xl max-h-[85vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pad-md border-b border-subtle">
            <h2 className="text-body-sm font-semibold">Configurações do Projeto</h2>
            <div className="flex items-center gap-xs">
              {dirty && (
                <Button variant="ghost" size="sm" onClick={handleReset} className="gap-xs px-sm">
                  <RotateCw className="w-3 h-3" />
                  <span className="hidden sm:inline text-caption">Restaurar</span>
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => { setResetMode(null); setShowResetConfirm(true); }} className="text-red-400 hover:bg-red-500/10 p-[6px]" title="Resetar">
                <Shield className="w-3.5 h-3.5" />
              </Button>
              <button onClick={onClose} className="w-7 h-7 radius-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary trans-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-subtle px-md">
            <div className="flex gap-xs overflow-x-auto pb-[1px]">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-xs px-md py-sm radius-t-lg font-medium text-caption trans-all whitespace-nowrap",
                    activeTab === tab.id
                      ? "text-primary bg-white/5 border-b-2 border-primary"
                      : "text-muted hover:text-primary"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pad-md gap-md">
            {activeTab === 'structure' && <StructureTab config={config} onChange={updateConfig} expanded={expandedSections} onToggle={toggleSection} sortedItems={sortedItems} />}
            {activeTab === 'tags' && <TagsTab config={config} onChange={updateConfig} expanded={expandedSections} onToggle={toggleSection} />}
            {activeTab === 'naming' && <NamingTab config={config} onChange={updateConfig} expanded={expandedSections} onToggle={toggleSection} />}
            {activeTab === 'todos' && <TodosTab config={config} onChange={updateConfig} expanded={expandedSections} onToggle={toggleSection} sortedItems={sortedItems} />}
            {activeTab === 'backup' && <BackupTab />}
          </div>

          {/* Footer */}
          <div className="pad-md border-t border-subtle flex items-center justify-between gap-sm">
            <Button variant="secondary" size="sm" onClick={onClose} className="px-md">Cancelar</Button>
            <Button size="sm" onClick={handleSave} className="gap-sm px-lg">
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Reset App Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-sm pad-lg"
          onClick={() => { setShowResetConfirm(false); setResetMode(null); }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-elevated border border-default radius-xl shadow-elev-5 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="pad-xl">
              <h3 className="text-body font-semibold text-primary mb-sm flex items-center gap-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                Resetar App
              </h3>
              
              <div className="gap-md mb-lg">
                <button
                  onClick={() => setResetMode('config')}
                  className={cn(
                    'w-full pad-md radius-lg border-2 text-left trans-all',
                    resetMode === 'config' ? 'border-emerald-500 bg-emerald-500/10' : 'border-default hover:border-muted'
                  )}
                >
                  <div className="flex items-start gap-md">
                    <div className={cn('w-8 h-8 radius-lg flex items-center justify-center flex-shrink-0 mt-xs', resetMode === 'config' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-hover text-muted')}>
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-body-sm">Resetar apenas configurações</p>
                      <p className="text-muted text-caption mt-xs">Restaura estrutura e tags para o padrão.</p>
                    </div>
                    {resetMode === 'config' && <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-xs" />}
                  </div>
                </button>

                <button
                  onClick={() => setResetMode('all')}
                  className={cn(
                    'w-full pad-md radius-lg border-2 text-left trans-all',
                    resetMode === 'all' ? 'border-red-500 bg-red-500/10' : 'border-default hover:border-muted'
                  )}
                >
                  <div className="flex items-start gap-md">
                    <div className={cn('w-8 h-8 radius-lg flex items-center justify-center flex-shrink-0 mt-xs', resetMode === 'all' ? 'bg-red-500/20 text-red-400' : 'bg-hover text-muted')}>
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary text-body-sm">Apagar TODOS os dados do app</p>
                      <p className="text-muted text-caption mt-xs"><strong className="text-red-400">IRREVERSÍVEL.</strong> Remove projetos e arquivos.</p>
                    </div>
                    {resetMode === 'all' && <Check className="w-5 h-5 text-red-400 flex-shrink-0 mt-xs" />}
                  </div>
                </button>
              </div>

              <div className="flex gap-sm justify-end pt-sm border-t border-subtle">
                <Button variant="secondary" size="sm" onClick={() => { setShowResetConfirm(false); setResetMode(null); }}>Cancelar</Button>
                <Button
                  size="sm"
                  onClick={handleResetApp}
                  disabled={!resetMode}
                  className={cn(resetMode === 'all' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700')}
                >
                  {resetMode === 'all' ? 'Confirmar Exclusão Total' : 'Resetar Configurações'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </TooltipProvider>
  )
}

// ── Collapsible Section ─────────────────────────────────────────────────────────
function Section({ title, icon, children, expanded, onToggle, description }: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  expanded: boolean
  onToggle: () => void
  description?: string
}) {
  return (
    <div className='bg-hover/40 border border-default/50 radius-lg overflow-hidden'>
      <button onClick={onToggle} className="w-full flex items-center justify-between pad-sm hover:bg-white/3 trans-colors">
        <div className="flex items-center gap-sm">
          <div className="w-6 h-6 radius flex items-center justify-center text-primary bg-primary/10">
            {icon}
          </div>
          <span className="font-medium text-caption text-primary">{title}</span>
        </div>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} className="text-muted flex-shrink-0">
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-md pb-md border-t border-subtle/50">
            {description && <p className="text-caption text-muted mb-sm mt-xs">{description}</p>}
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ListItem({ value, onEdit, onDelete }: { value: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-sm bg-base/40 border border-default/50 radius px-sm py-sm group">
      <span className="flex-1 text-caption text-primary truncate">{value}</span>
      <div className="flex items-center gap-xs opacity-0 group-hover:opacity-100 trans-opacity">
        <button onClick={onEdit} className="p-1 radius hover:bg-white/10 text-muted hover:text-primary trans-colors"><Edit2 className="w-3 h-3" /></button>
        <button onClick={onDelete} className="p-1 radius hover:bg-red-500/10 text-muted hover:text-red-400 trans-colors"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  )
}

function InlineList({ items, onChange, placeholder, addLabel, sortedItems }: {
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
  addLabel: string
  sortedItems?: (items: string[]) => string[]
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [newValue, setNewValue] = useState('')
  const displayItems = sortedItems ? sortedItems(items) : items

  const handleAdd = () => {
    if (!newValue.trim()) return
    onChange([...items, newValue.trim()])
    setNewValue('')
  }

  const handleEditSave = (index: number) => {
    if (!editValue.trim()) return
    const next = [...items]
    next[index] = editValue.trim()
    onChange(next)
    setEditingIndex(null)
  }

  return (
    <div className="gap-xs">
      {displayItems.map((item) => {
        const realIndex = items.indexOf(item)
        return (
          <ListItem
            key={item}
            value={item}
            onEdit={() => { setEditingIndex(realIndex); setEditValue(items[realIndex]); }}
            onDelete={() => onChange(items.filter((_, i) => i !== realIndex))}
          />
        )
      })}
      <div className="flex gap-xs pt-xs">
        {editingIndex !== null ? (
          <>
            <input
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleEditSave(editingIndex)}
              onBlur={() => handleEditSave(editingIndex)}
              autoFocus
              className="flex-1 bg-base border border-muted radius px-sm py-xs text-caption text-primary focus:outline-none"
            />
            <Button size="icon" variant="ghost" className="p-1 h-7 w-7" onClick={() => handleEditSave(editingIndex)}><Check className="w-3 h-3" /></Button>
            <Button size="icon" variant="ghost" className="p-1 h-7 w-7" onClick={() => setEditingIndex(null)}><X className="w-3 h-3" /></Button>
          </>
        ) : (
          <>
            <input
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder={placeholder}
              className="flex-1 bg-hover border border-default radius px-sm py-sm text-caption text-primary placeholder:text-muted focus:outline-none"
            />
            <Button size="sm" onClick={handleAdd} disabled={!newValue.trim()} className="gap-xs px-sm h-7">
              <Plus className="w-3 h-3" />
              <span className="text-caption">{addLabel}</span>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Structure Tab ───────────────────────────────────────────────────────────────
function StructureTab({ config, onChange, expanded, onToggle, sortedItems }: {
  config: ProjectConfig
  onChange: (path: string, value: any) => void
  expanded: Record<string, boolean>
  onToggle: (section: string) => void
  sortedItems: (items: string[]) => string[]
}) {
  const allFolders = [
    { key: 'projectSubfolders', title: 'Pastas do Projeto', tagConfigKey: 'projectFolders' },
    { key: 'albumSubfolders', title: 'Subpastas do Álbum', tagConfigKey: 'albumFolders' },
    { key: 'trackSubfolders', title: 'Subpastas da Faixa', tagConfigKey: 'trackFolders' },
  ] as const

  const [editingFolder, setEditingFolder] = useState<{ folderGroupKey: string; folderPath: string; isNew?: boolean } | null>(null)
  const [editFolderName, setEditFolderName] = useState('')

  // Converte flat list + nested paths em tree structure
  const buildFolderTree = (folderGroupKey: string) => {
    const flatFolders = config.folderStructure[folderGroupKey as keyof typeof config.folderStructure] as string[]
    const nestedConfig = config.folderTagConfig[allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey as keyof typeof config.folderTagConfig] || {}
    
    // Coleta todas as pastas: flat + nested paths (ex: "Stems/VOX")
    const allPaths = new Set<string>()
    flatFolders.forEach(f => allPaths.add(f))
    Object.keys(nestedConfig).forEach(p => allPaths.add(p))
    
    // Build tree
    const tree: Record<string, { children: string[]; tags: string[] }> = {}
    const roots: string[] = []
    
    Array.from(allPaths).sort().forEach(path => {
      const parts = path.split('/')
      let currentPath = ''
      parts.forEach((part, i) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part
        if (!tree[currentPath]) {
          tree[currentPath] = { children: [], tags: nestedConfig[currentPath] || [] }
        }
        if (i === 0) {
          if (!roots.includes(currentPath)) roots.push(currentPath)
        } else {
          const parentPath = parts.slice(0, i).join('/')
          if (!tree[parentPath].children.includes(currentPath)) {
            tree[parentPath].children.push(currentPath)
          }
        }
      })
    })
    
    return { tree, roots }
  }

  const toggleFolderTag = (folderKey: string, folderName: string, tagId: string) => {
    const currentTags = config.folderTagConfig[folderKey as keyof typeof config.folderTagConfig][folderName] || []
    const updated = currentTags.includes(tagId)
      ? currentTags.filter((t: string) => t !== tagId)
      : [...currentTags, tagId]
    onChange(`folderTagConfig.${folderKey}.${folderName}`, updated)
  }

  const startEditFolder = (folderGroupKey: string, folderPath: string) => {
    const name = folderPath.split('/').pop() || folderPath
    setEditingFolder({ folderGroupKey, folderPath, isNew: false })
    setEditFolderName(name)
  }

  const saveEditFolder = () => {
    if (!editingFolder || !editFolderName.trim()) return
    const { folderGroupKey, folderPath, isNew } = editingFolder
    const parts = folderPath.split('/')
    const parentPath = parts.slice(0, -1).join('/')
    const newPath = parentPath ? `${parentPath}/${editFolderName.trim()}` : editFolderName.trim()
    
    // Atualiza folderStructure (flat list) - para root folders
    if (!parentPath || isNew) {
      const flatFolders = config.folderStructure[folderGroupKey as keyof typeof config.folderStructure] as string[]
      const updatedFlat = flatFolders.map(f => f === folderPath ? newPath : f)
      // Se era nova e não estava na flat list, adiciona
      if (isNew && !flatFolders.includes(folderPath)) {
        onChange(`folderStructure.${folderGroupKey}`, [...updatedFlat, newPath])
      } else {
        onChange(`folderStructure.${folderGroupKey}`, updatedFlat)
      }
    }
    
    // Atualiza folderTagConfig - move as tags
    const tagConfigKey = allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey
    if (tagConfigKey) {
      const currentTags = config.folderTagConfig[tagConfigKey][folderPath] || []
      // Remove a chave antiga
      onChange(`folderTagConfig.${tagConfigKey}.${folderPath}`, '__DELETE__')
      // Adiciona a nova
      onChange(`folderTagConfig.${tagConfigKey}.${newPath}`, currentTags)
    }
    setEditingFolder(null)
  }

  const deleteFolder = (folderGroupKey: string, folderPath: string) => {
    // Remove da flat list (recursivamente para subpastas)
    const flatFolders = config.folderStructure[folderGroupKey as keyof typeof config.folderStructure] as string[]
    const updatedFlat = flatFolders.filter(f => !f.startsWith(folderPath + '/') && f !== folderPath)
    onChange(`folderStructure.${folderGroupKey}`, updatedFlat)
    
    // Remove do folderTagConfig (recursivamente)
    const tagConfigKey = allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey
    if (tagConfigKey) {
      Object.keys(config.folderTagConfig[tagConfigKey]).forEach(key => {
        if (key === folderPath || key.startsWith(folderPath + '/')) {
          onChange(`folderTagConfig.${tagConfigKey}.${key}`, '__DELETE__')
        }
      })
    }
    if (editingFolder?.folderPath === folderPath) setEditingFolder(null)
  }

  const addFolder = (folderGroupKey: string, parentPath?: string) => {
    const tagConfigKey = allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey
    const flatFolders = config.folderStructure[folderGroupKey as keyof typeof config.folderStructure] as string[]
    
    // Conta irmãos existentes no mesmo nível
    const existingCount = Object.keys(config.folderTagConfig[tagConfigKey as keyof typeof config.folderTagConfig] || {}).filter(k => 
      parentPath ? k.startsWith(parentPath + '/') && k.split('/').length === parentPath.split('/').length + 1 : !k.includes('/')
    ).length
    const newName = `Nova Pasta ${existingCount + 1}`
    const newPath = parentPath ? `${parentPath}/${newName}` : newName
    
    // Adiciona na flat list se for root
    if (!parentPath) {
      onChange(`folderStructure.${folderGroupKey}`, [...flatFolders, newPath])
    }
    // Adiciona no folderTagConfig
    onChange(`folderTagConfig.${tagConfigKey}.${newPath}`, [])
    // Inicia edição marcando como novo
    setEditingFolder({ folderGroupKey, folderPath: newPath, isNew: true })
    setEditFolderName(newName)
  }

  const cancelEditFolder = () => {
    if (editingFolder?.isNew) {
      // Se era uma pasta nova, remove do config
      const { folderGroupKey, folderPath } = editingFolder!
      const parts = folderPath.split('/')
      const parentPath = parts.slice(0, -1).join('/')
      
      // Remove da flat list se foi adicionada
      if (!parentPath) {
        const flatFolders = config.folderStructure[folderGroupKey as keyof typeof config.folderStructure] as string[]
        onChange(`folderStructure.${folderGroupKey}`, flatFolders.filter(f => f !== folderPath))
      }
      // Remove do folderTagConfig
      const tagConfigKey = allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey
      if (tagConfigKey) {
        onChange(`folderTagConfig.${tagConfigKey}.${folderPath}`, '__DELETE__')
      }
    }
    setEditingFolder(null)
  }

  const renderFolderNode = (folderGroupKey: string, folderPath: string, tree: Record<string, { children: string[]; tags: string[] }>, depth: number = 0) => {
    const node = tree[folderPath]
    if (!node) return null
    const folderName = folderPath.split('/').pop() || folderPath
    const isEditing = editingFolder?.folderGroupKey === folderGroupKey && editingFolder?.folderPath === folderPath
    const allowedTags = node.tags
    const tagConfigKey = allFolders.find(f => f.key === folderGroupKey)?.tagConfigKey!
    
    return (
      <div key={folderPath} className={depth > 0 ? 'ml-6' : ''}>
        <div className="bg-base/50 border border-subtle radius pad-sm gap-sm">
          <div className="flex items-center gap-sm">
            {isEditing ? (
              <div className="flex items-center gap-xs flex-1">
                <input
                  value={editFolderName}
                  onChange={e => setEditFolderName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveEditFolder()}
                  onBlur={saveEditFolder}
                  autoFocus
                  className="flex-1 bg-base border border-muted radius px-sm py-xs text-caption text-primary focus:outline-none"
                />
                <Button size="icon" variant="ghost" className="p-1 h-7 w-7" onClick={saveEditFolder}><Check className="w-3 h-3" /></Button>
                <Button size="icon" variant="ghost" className="p-1 h-7 w-7" onClick={cancelEditFolder}><X className="w-3 h-3" /></Button>
              </div>
            ) : (
              <>
                <span className="flex-1 text-caption font-medium text-primary truncate flex items-center gap-xs">
                  📁 {folderName}
                </span>
                <div className="flex items-center gap-xs">
                  <button onClick={() => startEditFolder(folderGroupKey, folderPath)} className="p-1 radius hover:bg-white/10 text-muted hover:text-primary trans-colors" title="Renomear"><Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => addFolder(folderGroupKey, folderPath)} className="p-1 radius hover:bg-white/10 text-muted hover:text-primary trans-colors" title="Adicionar subpasta"><Plus className="w-3 h-3" /></button>
                  <button onClick={() => deleteFolder(folderGroupKey, folderPath)} className="p-1 radius hover:bg-red-500/10 text-muted hover:text-red-400 trans-colors" title="Excluir"><Trash2 className="w-3 h-3" /></button>
                </div>
              </>
            )}
          </div>

          {/* Tags checkboxes */}
          <div className="flex flex-wrap gap-xs pt-xs">
            {config.tags.map(tag => {
              const isAllowed = allowedTags.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleFolderTag(tagConfigKey, folderPath, tag.id)}
                  className={cn(
                    "px-sm py-[2px] radius text-[11px] font-medium trans-all border",
                    isAllowed 
                      ? "bg-primary/20 border-primary text-primary shadow-sm" 
                      : "bg-base/50 border-default text-muted hover:text-primary"
                  )}
                >
                  {tag.label} {isAllowed ? '✓' : ''}
                </button>
              )
            })}
          </div>
        </div>
        
        {node.children.map(childPath => 
          renderFolderNode(folderGroupKey, childPath, tree, depth + 1)
        )}
      </div>
    )
  }

  return (
    <div className="gap-sm">
      {allFolders.map(folderGroup => {
        const { tree, roots } = buildFolderTree(folderGroup.key)
        
        return (
          <Section
            key={folderGroup.key}
            title={folderGroup.title}
            icon={<FolderOpen className="w-3.5 h-3.5" />}
            expanded={expanded[folderGroup.key]}
            onToggle={() => onToggle(folderGroup.key)}
            description="Gerencie as pastas e defina quais TAGS são aceitas em cada uma para organização automática. Use + para criar subpastas."
          >
            <div className="gap-sm">
              {/* Botão para adicionar pasta no nível raiz */}
              <div className="flex justify-end mb-xs">
                <Button size="sm" variant="outline" onClick={() => addFolder(folderGroup.key)} className="gap-xs px-md h-7">
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-caption">Adicionar pasta</span>
                </Button>
              </div>
              
              {roots.length > 0 ? (
                roots.map(rootPath => renderFolderNode(folderGroup.key, rootPath, tree))
              ) : (
                <div className="bg-base/50 border border-subtle/50 radius pad-md text-center">
                  <p className="text-caption text-muted mb-sm">Nenhuma pasta configurada</p>
                  <Button size="sm" onClick={() => addFolder(folderGroup.key)} className="gap-xs px-md h-7">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar primeira pasta</span>
                  </Button>
                </div>
              )}
            </div>
          </Section>
        )
      })}
    </div>
  )
}

// ── Tags Tab ────────────────────────────────────────────────────────────────────
function TagsTab({ config, onChange, expanded, onToggle }: {
  config: ProjectConfig
  onChange: (path: string, value: any) => void
  expanded: Record<string, boolean>
  onToggle: (section: string) => void
}) {
  const [newTagLabel, setNewTagLabel] = useState('')
  const [newTagExts, setNewTagExts] = useState('')
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editExtsInput, setEditExtsInput] = useState('')

  const handleAddTag = () => {
    if (!newTagLabel.trim()) return
    const id = newTagLabel.trim().toLowerCase().replace(/\s+/g, '_')
    if (config.tags.some(t => t.id === id)) return

    const exts = newTagExts.split(',').map(e => e.trim().startsWith('.') ? e.trim() : `.${e.trim()}`).filter(e => e.length > 1)
    const newTag: Tag = { id, label: newTagLabel.trim(), extensions: exts, color: '#3b82f6' }
    onChange('tags', [...config.tags, newTag])
    setNewTagLabel('')
    setNewTagExts('')
  }

  const handleDeleteTag = (id: string) => {
    onChange('tags', config.tags.filter(t => t.id !== id))
  }

  const handleSaveExtensions = (id: string) => {
    const exts = editExtsInput.split(',').map(e => e.trim().startsWith('.') ? e.trim() : `.${e.trim()}`).filter(e => e.length > 1)
    const updated = config.tags.map(t => t.id === id ? { ...t, extensions: exts } : t)
    onChange('tags', updated)
    setEditingTagId(null)
  }

  return (
    <div className="gap-sm">
      <Section
        title="Gerenciamento de Tags"
        icon={<TagIcon className="w-3.5 h-3.5" />}
        expanded={expanded.tagsManager}
        onToggle={() => onToggle('tagsManager')}
        description="Crie e gerencie tags de arquivos. Cada tag agrupa extensões específicas para classificar seus arquivos."
      >
        <div className="gap-lg">
          {/* List of Tags */}
          <div className="gap-sm">
            {config.tags.map(tag => (
              <div key={tag.id} className="bg-base/40 border border-subtle radius-lg pad-sm gap-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    <span className="w-2.5 h-2.5 radius-full" style={{ backgroundColor: tag.color || '#3b82f6' }} />
                    <span className="text-caption font-semibold text-primary">{tag.label}</span>
                    <span className="text-[10px] text-muted font-mono">({tag.id})</span>
                  </div>
                  {!tag.isSystem && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTag(tag.id)} className="h-6 px-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 text-caption">
                      Excluir Tag
                    </Button>
                  )}
                </div>

                <div className="gap-xs">
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span>Extensões associadas:</span>
                    {editingTagId !== tag.id && (
                      <button onClick={() => { setEditingTagId(tag.id); setEditExtsInput(tag.extensions.join(', ')); }} className="text-primary hover:underline text-[11px] trans-colors">
                        Editar extensões
                      </button>
                    )}
                  </div>

                  {editingTagId === tag.id ? (
                    <div className="flex gap-xs pt-xs">
                      <input
                        value={editExtsInput}
                        onChange={e => setEditExtsInput(e.target.value)}
                        placeholder=".mp3, .wav, .flac"
                        className="flex-1 bg-base border border-default radius px-sm py-xs text-caption text-primary focus:outline-none"
                      />
                      <Button size="sm" className="h-7 px-sm" onClick={() => handleSaveExtensions(tag.id)}>Salvar</Button>
                      <Button size="sm" variant="ghost" className="h-7 px-sm" onClick={() => setEditingTagId(null)}>Cancelar</Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-xs">
                      {tag.extensions.length > 0 ? (
                        tag.extensions.map(ext => (
                          <span key={ext} className="px-xs py-[2px] bg-hover border border-default/60 radius text-[11px] font-mono text-secondary">
                            {ext}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-muted italic">Aceita qualquer extensão (Catch-all)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Tag */}
          <div className="bg-base/60 border border-subtle radius-lg pad-md gap-sm">
            <p className="text-caption font-medium text-primary">Adicionar Nova Tag</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <input
                value={newTagLabel}
                onChange={e => setNewTagLabel(e.target.value)}
                placeholder="Nome da Tag (ex: Presets)"
                className="bg-base border border-default radius px-sm py-sm text-caption text-primary placeholder:text-muted focus:outline-none"
              />
              <input
                value={newTagExts}
                onChange={e => setNewTagExts(e.target.value)}
                placeholder="Extensões (.fxp, .vital, .nmsv)"
                className="bg-base border border-default radius px-sm py-sm text-caption text-primary placeholder:text-muted focus:outline-none"
              />
            </div>
            <div className="flex justify-end pt-xs">
              <Button size="sm" onClick={handleAddTag} disabled={!newTagLabel.trim()} className="gap-xs px-md h-7">
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Tag</span>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

// ── Naming Tab ──────────────────────────────────────────────────────────────────
function NamingTab({ config, onChange, expanded, onToggle }: {
  config: ProjectConfig
  onChange: (path: string, value: any) => void
  expanded: Record<string, boolean>
  onToggle: (section: string) => void
}) {
  return (
    <div className="gap-sm">
      <Section title="Número da Faixa" icon={<Type className="w-3.5 h-3.5" />} expanded={expanded.naming} onToggle={() => onToggle('naming')}>
        <div className="gap-sm">
          <div>
            <label className="text-caption font-medium text-secondary block mb-xs">Formato</label>
            <div className="flex gap-xs">
              {['02d', '03d', 'none'].map(format => (
                <label key={format} className={cn("flex-1 flex items-center justify-center p-sm radius border trans-colors cursor-pointer text-caption font-medium", config.naming.trackNumberFormat === format ? 'border-primary bg-primary/20 text-primary' : 'border-default hover:border-muted text-muted')}>
                  <input type="radio" value={format} checked={config.naming.trackNumberFormat === format} onChange={e => onChange('naming.trackNumberFormat', e.target.value)} className="sr-only" />
                  <span>{format === '02d' ? '01, 02...' : format === '03d' ? '001, 002...' : '1, 2...'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-caption font-medium text-secondary block mb-xs">Separador</label>
            <input value={config.naming.trackSeparator} onChange={e => onChange('naming.trackSeparator', e.target.value)} className="w-full bg-base border border-default radius px-sm py-sm text-caption text-primary" placeholder=" - " />
          </div>

          <label className="flex items-center gap-sm cursor-pointer pt-xs">
            <input type="checkbox" checked={config.naming.sanitizeNames} onChange={e => onChange('naming.sanitizeNames', e.target.checked)} className="w-4 h-4 radius border-default bg-base" />
            <span className="text-caption text-primary">Sanitizar nomes (remover caracteres inválidos)</span>
          </label>
        </div>
      </Section>
    </div>
  )
}

// ── Todos Tab ───────────────────────────────────────────────────────────────────
function TodosTab({ config, onChange, expanded, onToggle, sortedItems }: {
  config: ProjectConfig
  onChange: (path: string, value: any) => void
  expanded: Record<string, boolean>
  onToggle: (section: string) => void
  sortedItems: (items: string[]) => string[]
}) {
  return (
    <div className="gap-sm">
      <Section title="Visibilidade das Tarefas" icon={<Eye className="w-3.5 h-3.5" />} expanded={expanded.todoVisibility} onToggle={() => onToggle('todoVisibility')}>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="font-medium text-caption text-primary">Exibir tarefas nos projetos</p>
            <p className="text-caption text-muted">Mostra lista de tarefas nos cards de álbum e faixa</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('todoTemplates.showInProjects', !config.todoTemplates.showInProjects)}
            className={cn('w-10 h-5 radius-full flex items-center trans-all p-[2px]', config.todoTemplates.showInProjects ? 'bg-emerald-500 justify-end' : 'bg-default justify-start')}
          >
            <div className="w-4 h-4 bg-primary radius-full shadow-sm" />
          </button>
        </label>
      </Section>

      <Section title="Tarefas Padrão do Álbum" icon={<ClipboardList className="w-3.5 h-3.5" />} expanded={expanded.albumTodos} onToggle={() => onToggle('albumTodos')}>
        <InlineList items={config.todoTemplates.album} onChange={items => onChange('todoTemplates.album', items)} placeholder="Nova tarefa" addLabel="Adicionar" sortedItems={sortedItems} />
      </Section>

      <Section title="Tarefas Padrão da Faixa" icon={<ClipboardList className="w-3.5 h-3.5" />} expanded={expanded.trackTodos} onToggle={() => onToggle('trackTodos')}>
        <InlineList items={config.todoTemplates.track} onChange={items => onChange('todoTemplates.track', items)} placeholder="Nova tarefa" addLabel="Adicionar" sortedItems={sortedItems} />
      </Section>
    </div>
  )
}

// ── Backup Tab ────────────────────────────────────────────────────────────────────
function BackupTab() {
  const [mode, setMode] = useState<'idle' | 'export' | 'import'>('idle')
  const [subMode, setSubMode] = useState<'config' | 'full' | null>(null)
  const [loading, setLoading] = useState<{ type: 'export' | 'import'; sub: 'config' | 'full' } | null>(null)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const handleExport = async (type: 'config' | 'full') => {
    setLoading({ type: 'export', sub: type })
    try {
      const res = type === 'config'
        ? await window.electronAPI!.configExport()
        : await window.electronAPI!.backupExport({ includeConfig: true, includeProjects: true, includeAlbums: true, includeFiles: true })
      if (res.ok) setResult({ ok: true, message: `Salvo em:\n${res.path}\n${res.fileCount ? `${res.fileCount} arquivos incluídos` : ''}` })
      else if (!res.canceled) setResult({ ok: false, message: res.error || 'Erro' })
    } catch (e: any) { setResult({ ok: false, message: e.message }) }
    finally { setLoading(null) }
  }

  const handleImport = async (zipPath: string, type: 'config' | 'full') => {
    setLoading({ type: 'import', sub: type })
    try {
      const res = type === 'config'
        ? await window.electronAPI!.configImport(JSON.parse(await (await fetch(zipPath)).text())) // won't be used for config
        : await window.electronAPI!.backupImport(zipPath)
      if (res.ok) {
        setResult({ ok: true, message: type === 'config' ? 'Configurações importadas' : `Backup restaurado${res.fileCount ? ` (${res.fileCount} arquivos)` : ''}` })
        setTimeout(() => window.location.reload(), 1500)
      } else setResult({ ok: false, message: res.error || 'Erro' })
    } catch { setResult({ ok: false, message: 'Arquivo inválido' }) }
    finally { setLoading(null) }
  }

  const pickZipFile = (type: 'config' | 'full') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = type === 'config' ? '.json' : '.zip'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleImport(URL.createObjectURL(file), type)
    }
    input.click()
  }

  // For config import, we still need JSON parsing
  const pickJsonFile = (type: 'config') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setLoading({ type: 'import', sub: 'config' })
        try {
          const text = await file.text()
          const data = JSON.parse(text)
          const res = await window.electronAPI!.configImport(data)
          if (res.ok) {
            setResult({ ok: true, message: 'Configurações importadas' })
            setTimeout(() => window.location.reload(), 1500)
          } else setResult({ ok: false, message: res.error || 'Erro' })
        } catch { setResult({ ok: false, message: 'Arquivo inválido' }) }
        finally { setLoading(null) }
      }
    }
    input.click()
  }

  const isExportLoading = loading?.type === 'export'
  const isImportLoading = loading?.type === 'import'

  return (
    <div className="gap-md">
      {/* Main choice */}
      {mode === 'idle' && (
        <div className="grid gap-md sm:grid-cols-2">
          <Button
            size="lg"
            className="h-20 flex flex-col items-center justify-center gap-xs px-md"
            onClick={() => setMode('export')}
            style={{ backgroundColor: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            <Download className="w-5 h-5" />
            <span className="text-body-sm font-medium">Exportar</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-20 flex flex-col items-center justify-center gap-xs px-md"
            onClick={() => setMode('import')}
          >
            <Upload className="w-5 h-5" />
            <span className="text-body-sm font-medium">Importar</span>
          </Button>
        </div>
      )}

      {/* Export options */}
      {mode === 'export' && (
        <div className="gap-sm animate-in slide-in-from-top">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-sm h-9 px-md"
            onClick={() => setMode('idle')}
          >
            <span className="text-caption text-muted">← Voltar</span>
          </Button>
          <div className="grid gap-md sm:grid-cols-2">
            <div className="bg-base/40 border border-subtle radius-lg pad-md">
              <p className="text-body-sm font-medium text-primary">Configurações</p>
              <p className="text-caption text-muted mt-xs">Tags, pastas, nomenclatura, tarefas</p>
              <Button
                size="sm"
                className="w-full mt-sm gap-xs"
                onClick={() => handleExport('config')}
                disabled={isExportLoading && loading.sub === 'config'}
                variant="outline"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-caption">Exportar .json</span>
                {isExportLoading && loading.sub === 'config' && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-primary radius-full animate-spin" />}
              </Button>
            </div>
            <div className="bg-base/40 border radius-lg pad-md" style={{ borderColor: 'hsl(var(--primary))' }}>
              <p className="text-body-sm font-medium text-primary">Backup Completo (ZIP)</p>
              <p className="text-caption text-muted mt-xs">Projetos + álbuns + faixas + <strong>arquivos de áudio/capas</strong></p>
              <Button
                size="sm"
                className="w-full mt-sm gap-xs"
                onClick={() => handleExport('full')}
                disabled={isExportLoading && loading.sub === 'full'}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span className="text-caption">Exportar .zip</span>
                {isExportLoading && loading.sub === 'full' && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white radius-full animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import options */}
      {mode === 'import' && (
        <div className="gap-sm animate-in slide-in-from-top">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-sm h-9 px-md"
            onClick={() => setMode('idle')}
          >
            <span className="text-caption text-muted">← Voltar</span>
          </Button>
          <div className="grid gap-md sm:grid-cols-2">
            <div className="bg-base/40 border border-subtle radius-lg pad-md">
              <p className="text-body-sm font-medium text-primary">Importar Config</p>
              <p className="text-caption text-muted mt-xs">Substitui apenas configurações (.json)</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-sm gap-xs"
                onClick={() => pickJsonFile('config')}
                disabled={isImportLoading && loading.sub === 'config'}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-caption">Selecionar .json</span>
                {isImportLoading && loading.sub === 'config' && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-primary radius-full animate-spin" />}
              </Button>
            </div>
            <div className="bg-base/40 border border-amber-500/30 radius-lg pad-md bg-amber-500/5">
              <p className="text-body-sm font-medium text-primary">Restaurar Backup Completo</p>
              <p className="text-caption text-amber-400 mt-xs">⚠ Sobrescreve TUDO + restaura arquivos (.zip)</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-sm gap-xs border-amber-500 text-amber-400 hover:bg-amber-500/10 trans-colors"
                onClick={() => pickZipFile('full')}
                disabled={isImportLoading && loading.sub === 'full'}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-caption">Selecionar .zip</span>
                {isImportLoading && loading.sub === 'full' && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-amber-400 radius-full animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className={cn('pad-md radius-lg text-caption animate-in slide-in-from-top', result.ok ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border border-red-500/30 text-red-300')}>
          <pre className="whitespace-pre-wrap font-mono">{result.message}</pre>
        </div>
      )}
    </div>
  )
}