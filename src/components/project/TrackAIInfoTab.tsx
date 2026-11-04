'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, FileText, Sparkles, Settings, PenTool, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface TrackAIInfoTabProps {
  track: import('@/types').Track
  projectColor: string
  onSave: (changes: Partial<import('@/types').Track>) => void
}

export function TrackAIInfoTab({ track, projectColor, onSave }: TrackAIInfoTabProps) {
  const [form, setForm] = useState({
    prompt: track.prompt || '',
    positivePrompt: track.positivePrompt || '',
    style: track.style || '',
    mode: track.mode || '',
    notes: track.notes || '',
  })
  const [dirty, setDirty] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    if (!text.trim()) return
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = () => {
    onSave({ ...form })
    setDirty(false)
  }

  const accentStyle = { '--accent': projectColor } as React.CSSProperties

  const detailFields = [
    {
      key: 'prompt',
      label: 'Prompt Utilizado',
      placeholder: 'Prompt principal usado na IA (ex: Suno, Udio, etc.)',
      icon: <Sparkles className="w-4 h-4" />,
      rows: 4,
      copyable: true,
    },
    {
      key: 'positivePrompt',
      label: 'Positivos (Positive Prompt)',
      placeholder: 'Tags positivas, estilos desejados, instrumentação...',
      icon: <Sparkles className="w-4 h-4" />,
      rows: 4,
      copyable: true,
    },
    {
      key: 'style',
      label: 'Estilos / Tags de Estilo',
      placeholder: 'Ex: synthwave, dark ambient, female vocals, 120bpm, minor key...',
      icon: <Settings className="w-4 h-4" />,
      rows: 3,
      copyable: true,
    },
    {
      key: 'mode',
      label: 'Modo / Modelo',
      placeholder: 'Ex: Suno v3.5, Udio 130, Chirp, custom...',
      icon: <PenTool className="w-4 h-4" />,
      rows: 2,
      copyable: true,
    },
    {
      key: 'notes',
      label: 'Observações',
      placeholder: 'Notas livres: ajustes manuais, ideias para próxima versão, referências...',
      icon: <FileText className="w-4 h-4" />,
      rows: 4,
      copyable: false,
    },
  ]

  const renderDetailField = (field: typeof detailFields[number], idx: number, fillHeight = false) => (
    <motion.div
      key={field.key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className={cn("space-y-2 min-h-0", fillHeight && "h-full flex flex-col")}
    >
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <span className="text-neutral-500">{field.icon}</span>
          {field.label}
        </label>
        {field.copyable && form[field.key] && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(form[field.key], field.key)}
            className={cn(copied === field.key && "text-emerald-400")}
          >
            {copied === field.key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
      <textarea
        value={form[field.key]}
        onChange={e => {
          setForm(f => ({ ...f, [field.key]: e.target.value }))
          setDirty(true)
        }}
        placeholder={field.placeholder}
        rows={field.rows}
        className={cn(
          "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 resize-y transition-colors font-mono text-xs leading-relaxed",
          fillHeight && "flex-1 min-h-[280px]"
        )}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          borderColor: dirty && form[field.key] ? projectColor + '40' : 'transparent',
        }}
      />
    </motion.div>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-4 border-b border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-neutral-300">Informações da Track</h3>
          <span className="text-xs text-neutral-500 px-2 py-0.5 bg-white/5 rounded">IA</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            size="sm"
            style={accentStyle}
            disabled={!dirty}
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </Button>
        </div>
      </div>

      <p className="text-xs text-neutral-500 px-2 py-2 border-b border-neutral-800 flex-shrink-0">
        Centralize aqui todos os dados de geração por IA. Útil para replicar, versionar ou documentar o processo criativo.
      </p>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full min-h-0 overflow-y-auto p-2">
          <div className="grid grid-cols-1 gap-4 lg:h-full lg:grid-cols-2">
            {renderDetailField(detailFields[0], 0, true)}
            <div className="space-y-4">
              {detailFields.slice(1).map((field, idx) => renderDetailField(field, idx + 1))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-3 pt-4 border-t border-neutral-800"
              >
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.prompt, 'prompt')} disabled={!form.prompt.trim()}>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar Prompt</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.positivePrompt, 'positivePrompt')} disabled={!form.positivePrompt.trim()}>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar Positivos</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(form.style, 'style')} disabled={!form.style.trim()}>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar Estilos</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}