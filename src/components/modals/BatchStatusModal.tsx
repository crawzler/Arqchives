'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { TRACK_STATUSES } from '@/types'
import { Button } from '@/components/ui/Button'

interface BatchStatusModalProps {
  count: number
  projectColor: string
  onConfirm: (status: import('@/types').TrackStatus) => void
  onClose: () => void
}

export function BatchStatusModal({ count, projectColor, onConfirm, onClose }: BatchStatusModalProps) {
  const [status, setStatus] = useState<import('@/types').TrackStatus>('idea')

  const handleConfirmClick = () => {
    onConfirm(status)
  }

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
        className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold">Status das {count} faixas</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-neutral-400">Qual o status inicial destas faixas?</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(TRACK_STATUSES).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setStatus(key as any)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border",
                  status === key
                    ? "border-neutral-500 bg-neutral-800 text-white"
                    : "border-transparent hover:bg-neutral-800 text-neutral-400"
                )}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                {info.label.split(' ')[1]}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1" style={{ '--accent': projectColor }} onClick={handleConfirmClick}>Confirmar</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}