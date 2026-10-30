'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { TRACK_STATUSES } from '@/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

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
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/60 backdrop-blur-sm pad-lg"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-elevated border border-default radius-xl shadow-elev-5 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pad-lg border-b border-subtle">
          <h2 className="text-heading-sm font-semibold">Status das {count} faixas</h2>
          <button onClick={onClose} className="w-8 h-8 radius-lg hover:bg-hover flex items-center justify-center text-muted hover:text-primary trans-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="pad-lg gap-lg">
          <p className="text-body-sm text-muted">Qual o status inicial destas faixas?</p>
          <div className="grid grid-cols-2 gap-sm">
            {Object.entries(TRACK_STATUSES).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setStatus(key as any)}
                className={cn(
                  "flex items-center gap-sm px-md py-sm radius-lg text-caption font-medium trans-all border",
                  status === key
                    ? "border-muted/50 bg-hover text-primary"
                    : "border-transparent hover:bg-hover text-muted"
                )}
              >
                <span className="w-2 h-2 radius-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                {info.label.split(' ')[1]}
              </button>
            ))}
          </div>
          <div className="flex gap-sm pt-sm">
            <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button className="flex-1" style={{ '--accent': projectColor }} onClick={handleConfirmClick}>Confirmar</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}