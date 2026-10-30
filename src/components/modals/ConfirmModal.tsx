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
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold">{title || 'Confirmação'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", iconColor)}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-2 pt-2">
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