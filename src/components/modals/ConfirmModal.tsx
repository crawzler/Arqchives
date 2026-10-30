'use client'

import { motion } from 'framer-motion'
import { X, AlertTriangle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onClose: () => void
  variant?: 'danger' | 'warning' | 'info'
  title?: string
  confirmText?: string
  cancelText?: string
}

export function ConfirmModal({ message, onConfirm, onClose, variant = 'danger', title, confirmText, cancelText }: ConfirmModalProps) {
  const variants = {
    danger: { icon: Trash2, iconColor: 'text-red-400', btnColor: 'bg-red-600 hover:bg-red-700' },
    warning: { icon: AlertTriangle, iconColor: 'text-amber-400', btnColor: 'bg-amber-600 hover:bg-amber-700' },
    info: { icon: AlertTriangle, iconColor: 'text-blue-400', btnColor: 'bg-blue-600 hover:bg-blue-700' },
  }

  const { icon: Icon, iconColor, btnColor } = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm pad-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-elevated border border-default radius-xl shadow-elev-5 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pad-lg border-b border-subtle">
          <h2 className="text-heading-sm font-semibold">{title || 'Confirmação'}</h2>
          <button onClick={onClose} className="w-8 h-8 radius-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary trans-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="pad-xl gap-lg">
          <div className="flex items-start gap-md">
            <div className={cn("w-10 h-10 radius-lg flex items-center justify-center flex-shrink-0", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-secondary text-body-sm leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-sm pt-sm">
            <Button variant="secondary" className="flex-1" onClick={onClose}>{cancelText || 'Cancelar'}</Button>
            <Button className={cn("flex-1", btnColor)} onClick={onConfirm}>
              {confirmText || (variant === 'danger' ? 'Deletar' : 'Confirmar')}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}