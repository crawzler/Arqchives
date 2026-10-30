'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, Upload } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { RELEASE_TYPES } from '@/types'
import { Album } from '@/types'

interface NewAlbumModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { title: string; type: 'Álbum' | 'EP' | 'Single' | 'Compilação'; year: number; month: number; description: string; coverPath: string | null; coverFilePath?: string }) => void
  initialData?: Album | null
}

export function NewAlbumModal({ open, onClose, onSubmit, initialData }: NewAlbumModalProps) {
  const { activeProjectId, projects } = useAppStore()
  const [form, setForm] = useState({
    title: '',
    type: 'Álbum' as 'Álbum' | 'EP' | 'Single' | 'Compilação',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    description: '',
    coverPath: '' as string | null,
    coverFilePath: '' as string,
  })
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const project = projects.find(p => p.id === activeProjectId)

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          title: initialData.title,
          type: initialData.type,
          year: initialData.year,
          month: (initialData as any).month || new Date().getMonth() + 1,
          description: initialData.description,
          coverPath: initialData.coverPath,
          coverFilePath: '',
        })
        setCoverPreview(initialData.coverPath)
      } else {
        setForm({
          title: '',
          type: 'Álbum',
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          description: '',
          coverPath: null,
          coverFilePath: '',
        })
        setCoverPreview(null)
      }
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [open, initialData])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleCoverSelect = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Selecionar capa do álbum',
      filters: [{ name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
      multiple: false,
    })
    if (!result?.[0]) return
    const filePath = result[0]
    const previewUrl = `file://${filePath.replace(/\\/g, '/')}`
    setCoverPreview(previewUrl)
    setForm(prev => ({ ...prev, coverPath: previewUrl, coverFilePath: filePath }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || submitting) return
    setSubmitting(true)
    onSubmit(form)
    setSubmitting(false)
  }

  const handleTypeChange = (type: 'Álbum' | 'EP' | 'Single' | 'Compilação') => {
    setForm(prev => ({ ...prev, type }))
  }

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold">{initialData ? 'Editar Álbum' : 'Novo Álbum'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">Título <span className="text-red-400">*</span></label>
            <input
              ref={titleRef}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nome do álbum..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Type & Cover */}
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <div className="space-y-4">
              <label className="text-xs font-medium text-neutral-300 block">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {RELEASE_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
                      form.type === type
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white hover:bg-neutral-800/50"
                    )}
                  >
                    <span>{getTypeIcon(type)}</span>
                    <span className="text-xs font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cover */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 block">Capa</label>
              <button
                type="button"
                onClick={handleCoverSelect}
                className={cn(
                  "w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors",
                  coverPreview ? "border-emerald-500" : "border-neutral-700 hover:border-neutral-500"
                )}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-neutral-500" />
                    <span className="text-[10px] text-neutral-500 mt-1">Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Year & Month */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Ano</label>
              <input
                type="number"
                value={form.year}
                onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Mês</label>
              <select
                value={form.month}
                onChange={e => setForm({ ...form, month: parseInt(e.target.value) })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('pt-BR', { month: 'long' })}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-neutral-300 block mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição do álbum, conceito, tema..."
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
            />
          </div>

          {/* Project Context */}
          {project && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
              {project.photo ? (
                <img src={project.photo} alt={project.name} className="w-10 h-10 rounded-md object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-md flex items-center justify-center text-lg"
                  style={{ backgroundColor: project.accent + '20' }}>
                  <span>🎵</span>
                </div>
              )}
              <div>
                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Projeto</p>
                <p className="text-sm font-semibold text-white">{project.name}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={submitting}>Cancelar</Button>
            <Button type="submit" className="flex-1" disabled={!form.title.trim() || submitting} style={{ '--accent': project?.accent } as React.CSSProperties}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (initialData ? 'Salvar alterações' : 'Criar álbum')}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function getTypeIcon(type: string): string {
  switch (type) {
    case 'Álbum': return '💿'
    case 'EP': return '📀'
    case 'Single': return '🎵'
    case 'Compilação': return '📚'
    default: return '💿'
  }
}