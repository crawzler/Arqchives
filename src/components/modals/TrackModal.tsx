'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Music2, Loader2, Sparkles, Brain, Settings, PenTool, FileText } from 'lucide-react'
import { useFileOperations } from '@/hooks/useElectron'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { TRACK_STATUSES } from '@/types'

interface TrackModalProps {
  track: import('@/types').Track | null
  projectColor: string
  onSave: (form: any) => void
  onClose: () => void
}

export function TrackModal({ track, projectColor, onSave, onClose }: TrackModalProps) {
  const { selectFiles } = useFileOperations()
  const [form, setForm] = useState({
    title: track?.title || '',
    number: track?.number || '',
    status: track?.status || 'idea',
    audioPath: track?.audioVersions?.[0]?.path || null,
    audioVersions: track?.audioVersions || [], // Preserve existing audioVersions
    bpm: track?.bpm || '',
    key: track?.key || '',
    notes: track?.notes || '',
    versionMode: track?.versionMode || 'single',
    // AI Fields
    lyrics: track?.lyrics || '',
    prompt: track?.prompt || '',
    positivePrompt: track?.positivePrompt || '',
    style: track?.style || '',
    mode: track?.mode || '',
  })
  const [audioName, setAudioName] = useState<string | null>(null)
  const [selectingAudio, setSelectingAudio] = useState(false)
  const [activeSection, setActiveSection] = useState<'main' | 'ai'>('main')
  const titleRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (track) {
      setForm(f => ({
        ...f,
        title: track.title || '',
        number: track.number || '',
        status: track.status || 'idea',
        audioPath: track.audioVersions?.[0]?.path || null,
        audioVersions: track.audioVersions || [],
        bpm: track.bpm || '',
        key: track.key || '',
        notes: track.notes || '',
        versionMode: track.versionMode || 'single',
        lyrics: track.lyrics || '',
        prompt: track.prompt || '',
        positivePrompt: track.positivePrompt || '',
        style: track.style || '',
        mode: track.mode || '',
      }))
      setAudioName(track.audioVersions?.[0]?.path?.split(/[\\/]/).pop() || null)
    }
    if (!form.audioPath && titleRef.current) {
      titleRef.current.focus()
    }
  }, [track])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSelectAudio = async () => {
    setSelectingAudio(true)
    const result = await selectFiles({
      title: 'Selecionar arquivo de áudio',
      filters: [{ name: 'Áudio', extensions: ['mp3', 'wav', 'flac', 'aiff', 'ogg', 'm4a', 'aac', 'wma'] }],
      multiple: false,
    })
    if (result?.[0]) {
      const filePath = result[0]
      const nameWithoutExt = filePath.split(/[\\/]/).pop()!.replace(/\.[^.]+$/, '')
      const { number, title } = parseTrackName(nameWithoutExt)
      setForm(f => ({
        ...f,
        audioPath: filePath,
        number: f.number || number,
        title: f.title.trim() ? f.title : title,
      }))
      setAudioName(filePath.split(/[\\/]/).pop() || null)
    }
    setSelectingAudio(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  const clearAudio = () => {
    setForm(f => ({ ...f, audioPath: null }))
    setAudioName(null)
  }

  const sections = [
    { id: 'main', label: 'Principal', icon: Music2 },
    { id: 'ai', label: 'Informações', icon: FileText },
  ]

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
        className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold">{track ? 'Editar Música' : 'Nova Música'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-neutral-800 px-4 bg-neutral-950/50">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as 'main' | 'ai')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative",
                activeSection === section.id
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              )}
              style={{
                borderBottom: activeSection === section.id ? `2px solid ${projectColor}` : '2px solid transparent',
              }}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* MAIN SECTION */}
          {activeSection === 'main' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Audio File */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 flex items-center gap-2"><Music2 className="w-3.5 h-3.5" /> Arquivo de Áudio</label>
                {audioName ? (
                  <div className="flex items-center justify-between p-3 bg-neutral-800 border border-neutral-700 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Music2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-white truncate max-w-[200px]">{audioName}</span>
                    </div>
                    <button type="button" onClick={clearAudio} className="w-8 h-8 rounded-lg hover:bg-red-600/20 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={handleSelectAudio}
                    disabled={selectingAudio}
                  >
                    <Music2 className="w-4 h-4" />
                    <span>{selectingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Selecionar arquivo de áudio'}</span>
                  </Button>
                )}
              </div>

              {/* Number & Title */}
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">Nº</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.number}
                    onChange={e => setForm({ ...form, number: e.target.value.replace(/\D/g, '') })}
                    placeholder="—"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">Título <span className="text-red-400">*</span></label>
                  <input
                    ref={titleRef}
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Nome da música..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as import('@/types').TrackStatus })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {Object.entries(TRACK_STATUSES).map(([key, info]) => (
                    <option key={key} value={key} style={{ color: info.color }}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Version Mode */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Modo de Versões</label>
                <select
                  value={form.versionMode}
                  onChange={e => setForm({ ...form, versionMode: e.target.value as 'single' | 'dual' })}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="single">Apenas versão final</option>
                  <option value="dual">Duas versões (Pré-Mix + Master)</option>
                </select>
                <p className="text-xs text-neutral-500 mt-1">
                  {form.versionMode === 'single' 
                    ? 'Track terá apenas a versão final masterizada' 
                    : 'Track terá Pré-Mix e Master para comparação'}
                </p>
              </div>

              {/* BPM & Key */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">BPM</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.bpm}
                    onChange={e => setForm({ ...form, bpm: e.target.value.replace(/\D/g, '') })}
                    placeholder="120"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-300 block mb-1">Tom</label>
                  <input
                    value={form.key}
                    onChange={e => setForm({ ...form, key: e.target.value })}
                    placeholder="C#m"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">Notas Gerais</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anotações sobre a faixa..."
                  rows={3}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* AI SECTION */}
          {activeSection === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-xs text-neutral-500 mb-2">Centralize aqui todos os dados de geração por IA. Útil para replicar, versionar ou documentar o processo criativo.</p>

              <div className="space-y-4">
                {/* Lyrics */}
                <div>
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2 block mb-1"><FileText className="w-3.5 h-3.5" /> Letra da Música</label>
                  <textarea
                    value={form.lyrics}
                    onChange={e => setForm({ ...form, lyrics: e.target.value })}
                    placeholder="Cole a letra completa aqui..."
                    rows={8}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-y font-mono text-xs leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                  />
                </div>

                {/* Prompt */}
                <div>
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2 block mb-1"><Sparkles className="w-3.5 h-3.5" /> Prompt Utilizado</label>
                  <textarea
                    value={form.prompt}
                    onChange={e => setForm({ ...form, prompt: e.target.value })}
                    placeholder="Prompt principal usado na IA (ex: Suno, Udio, etc.)"
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-y font-mono text-xs leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                  />
                </div>

                {/* Positive Prompt */}
                <div>
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2 block mb-1"><Brain className="w-3.5 h-3.5" /> Positivos (Positive Prompt)</label>
                  <textarea
                    value={form.positivePrompt}
                    onChange={e => setForm({ ...form, positivePrompt: e.target.value })}
                    placeholder="Tags positivas, estilos desejados, instrumentação..."
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-y font-mono text-xs leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                  />
                </div>

                {/* Style */}
                <div>
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2 block mb-1"><Settings className="w-3.5 h-3.5" /> Estilos / Tags de Estilo</label>
                  <textarea
                    value={form.style}
                    onChange={e => setForm({ ...form, style: e.target.value })}
                    placeholder="Ex: synthwave, dark ambient, female vocals, 120bpm, minor key..."
                    rows={2}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-y font-mono text-xs leading-relaxed"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="text-xs font-medium text-neutral-300 flex items-center gap-2 block mb-1"><PenTool className="w-3.5 h-3.5" /> Modo / Modelo</label>
                  <input
                    value={form.mode}
                    onChange={e => setForm({ ...form, mode: e.target.value })}
                    placeholder="Ex: Suno v3.5, Udio 130, Chirp, custom..."
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 font-mono text-xs"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-neutral-800 mt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1" style={{ '--accent': projectColor }} disabled={!form.title.trim()}>
              {track ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function parseTrackName(nameWithoutExt: string) {
  const s = nameWithoutExt.trim()
  const patterns = [
    /^(?:track\s*)?(\d+)\s*[-–.]\s*(.+)$/i,
    /^(\d+)\s+(.+)$/,
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) return { number: parseInt(m[1], 10).toString(), title: m[2].trim() }
  }
  return { number: '', title: s }
}