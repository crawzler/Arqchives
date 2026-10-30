'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Image, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PROJECT_COLORS } from '@/lib/constants'
import { TooltipProvider } from '@/components/ui/Tooltip'

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; genre: string; photo: string; photoFilePath?: string; accent: string }) => void
}

export function NewProjectModal({ open, onClose, onSubmit }: NewProjectModalProps) {
  const [form, setForm] = useState({ name: '', genre: '', photo: '', photoFilePath: '', color: PROJECT_COLORS[0] })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [colorIndex, setColorIndex] = useState(0)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setForm({ name: '', genre: '', photo: '', photoFilePath: '', color: PROJECT_COLORS[colorIndex] })
      setPhotoPreview(null)
    }
  }, [open])

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSubmit({ 
      name: form.name.trim(), 
      genre: form.genre.trim(), 
      photo: form.photo, // data URL for immediate preview
      photoFilePath: form.photoFilePath, // original file path for organization
      accent: form.color 
    })
    onClose()
    setForm({ name: '', genre: '', photo: '', photoFilePath: '', color: PROJECT_COLORS[colorIndex] })
    setPhotoPreview(null)
  }

  const handlePhotoSelect = async () => {
    const result = await window.electronAPI?.selectFiles({
      title: 'Selecionar foto do projeto',
      filters: [{ name: 'Imagens', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'] }],
      multiple: false,
    })
    if (!result?.[0]) return
    const filePath = result[0]
    const previewUrl = `file://${filePath.replace(/\\/g, '/')}`
    setPhotoPreview(previewUrl)
    setForm({ ...form, photo: previewUrl, photoFilePath: filePath })
  }

  if (!open) return null

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Animated icon at top */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center pt-4 pb-2"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary))/20 0%, hsl(var(--accent))/10 100%)', border: '1px solid hsl(var(--primary))/30' }}
            >
              <Sparkles className="w-7 h-7" style={{ color: 'hsl(var(--primary))' }} />
            </motion.div>
          </motion.div>

          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-neutral-800">
            <h2 className="text-sm font-semibold">Novo Projeto</h2>
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Nome do Projeto</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Meu Álbum, Banda X, Projeto Solo"
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
                autoFocus
              />
            </div>

            {/* Genre */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-1">Gênero (opcional)</label>
              <input
                value={form.genre}
                onChange={e => setForm({ ...form, genre: e.target.value })}
                placeholder="Ex: Rock, Electronic, Hip Hop, Ambient"
                className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-2">Cor de Destaque</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {PROJECT_COLORS.map((color, i) => (
                  <button
                    key={color}
                    onClick={() => { setColorIndex(i); setForm({ ...form, color }) }}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all border-2",
                      colorIndex === i ? "border-white scale-105 shadow-lg" : "border-neutral-700 hover:border-white/30"
                    )}
                    style={{ backgroundColor: color }}
                    title={`Cor ${i + 1}`}
                  >
                    {colorIndex === i && <span className="w-5 h-5 text-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="text-xs font-medium text-neutral-300 block mb-2">Foto do Projeto (opcional)</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={handlePhotoSelect}
                    className={cn(
                      "w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors",
                      photoPreview ? "border-emerald-500" : "border-neutral-700 hover:border-white/30"
                    )}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-neutral-500">
                        <Image className="w-6 h-6" />
                        <span className="text-[10px]">Adicionar</span>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-400">Clique para selecionar uma imagem</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WebP • Máx. 2MB</p>
                  {photoPreview && (
                    <Button variant="ghost" size="sm" className="mt-2 text-red-400 hover:text-red-300" onClick={() => { setPhotoPreview(null); setForm({ ...form, photo: '' }); }}>
                      Remover foto
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose} className="px-3">Cancelar</Button>
            <Button size="sm" onClick={handleSubmit} className="gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Projeto</span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}