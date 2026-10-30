'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, FileText, Video, Smartphone, Hash, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface AlbumSocialTabProps {
  album: import('@/types').Album
  projectColor: string
  onSave: (changes: Partial<import('@/types').Album>) => void
}

export function AlbumSocialTab({ album, projectColor, onSave }: AlbumSocialTabProps) {
  const [format, setFormat] = useState<'full' | 'short'>('full')
  const [form, setForm] = useState({
    full: album.social?.full || { title: '', description: '', hashtags: '', credits: '' },
    short: album.social?.short || { title: '', description: '', hashtags: '', credits: '' },
  })
  const [dirty, setDirty] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = () => {
    const d = form[format]
    const text = [
      d.title && `🎵 ${d.title}`,
      d.description,
      d.hashtags,
      d.credits,
    ].filter(Boolean).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = () => {
    onSave({ social: form })
    setDirty(false)
  }

  const d = form[format]
  const hasContent = d.title || d.description || d.hashtags || d.credits

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-2">
      {/* Format Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setFormat('full')}
          className={cn(
            "flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all",
            format === 'full'
              ? "bg-white/10 border-white/20 text-white"
              : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white"
          )}
          style={{ borderColor: format === 'full' ? projectColor : 'transparent' }}
        >
          <Video className="w-5 h-5" />
          <span className="font-medium">Vídeo Completo</span>
        </button>
        <button
          onClick={() => setFormat('short')}
          className={cn(
            "flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all",
            format === 'short'
              ? "bg-white/10 border-white/20 text-white"
              : "border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-white"
          )}
          style={{ borderColor: format === 'short' ? projectColor : 'transparent' }}
        >
          <Smartphone className="w-5 h-5" />
          <span className="font-medium">Shorts / Reels</span>
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-6">
        <SocialField
          label="Título"
          placeholder={format === 'full' ? `${album.title} — Full Album` : `${album.title} #shorts`}
          value={d.title}
          onChange={e => { setForm(f => ({ ...f, [format]: { ...f[format], title: e.target.value } })); setDirty(true) }}
          icon={<FileText className="w-4 h-4" />}
          copyText={d.title}
          onCopy={() => copyToClipboard(d.title, 'title')}
          copied={copied === 'title'}
        />

        <SocialField
          label="Descrição"
          placeholder={format === 'full' ? 'Descrição para YouTube, Spotify, etc...' : 'Descrição curta para Shorts, Reels, TikTok...'}
          value={d.description}
          onChange={e => { setForm(f => ({ ...f, [format]: { ...f[format], description: e.target.value } })); setDirty(true) }}
          icon={<MessageSquare className="w-4 h-4" />}
          copyText={d.description}
          onCopy={() => copyToClipboard(d.description, 'description')}
          copied={copied === 'description'}
          asTextarea
          rows={format === 'full' ? 6 : 3}
        />

        <SocialField
          label="Hashtags"
          placeholder="#lofi #chillhop #album..."
          value={d.hashtags}
          onChange={e => { setForm(f => ({ ...f, [format]: { ...f[format], hashtags: e.target.value } })); setDirty(true) }}
          icon={<Hash className="w-4 h-4" />}
          copyText={d.hashtags}
          onCopy={() => copyToClipboard(d.hashtags, 'hashtags')}
          copied={copied === 'hashtags'}
          asTextarea
          rows={2}
        />

        <SocialField
          label="Créditos"
          placeholder="Music by... | Artwork by... | © 2026..."
          value={d.credits}
          onChange={e => { setForm(f => ({ ...f, [format]: { ...f[format], credits: e.target.value } })); setDirty(true) }}
          icon={<User className="w-4 h-4" />}
          copyText={d.credits}
          onCopy={() => copyToClipboard(d.credits, 'credits')}
          copied={copied === 'credits'}
          asTextarea
          rows={2}
        />
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hasContent ? 1 : 0, y: 0 }}
        className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800"
      >
        {hasContent && (
          <Button
            variant="ghost"
            onClick={copyAll}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar tudo</span>
              </>
            )}
          </Button>
        )}
        {dirty && (
          <Button onClick={handleSave} style={{ '--accent': projectColor }}>
            Salvar alterações
          </Button>
        )}
      </motion.div>
    </div>
  )
}

// ── Social Field Component ─────────────────────────────────────────────────────
interface SocialFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  icon: React.ReactNode
  copyText?: string
  onCopy?: () => void
  copied?: boolean
  asTextarea?: boolean
  rows?: number
}

function SocialField({ label, placeholder, value, onChange, icon, copyText, onCopy, copied, asTextarea, rows = 3 }: SocialFieldProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
          <span className="text-neutral-500">{icon}</span>
          {label}
        </label>
        {copyText && onCopy && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            className={cn(copied && "text-green-400")}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
      {asTextarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 resize-none transition-colors"
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-colors"
        />
      )}
    </motion.div>
  )
}

// Import MessageSquare for the icon
import { MessageSquare } from 'lucide-react'