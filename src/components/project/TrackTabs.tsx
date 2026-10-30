'use client'

import { motion } from 'framer-motion'
import { Music2, FileText, MessageSquare, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrackTabsProps {
  activeTab: 'player' | 'files' | 'social' | 'info'
  onChange: (tab: 'player' | 'files' | 'social' | 'info') => void
  projectColor: string
  hasAudio: boolean
}

export function TrackTabs({ activeTab, onChange, projectColor, hasAudio }: TrackTabsProps) {
  const tabs = [
    { id: 'player' as const, label: 'Player', icon: Music2, disabled: !hasAudio },
    { id: 'files' as const, label: 'Arquivos', icon: FileText },
    { id: 'social' as const, label: 'Social', icon: MessageSquare },
    { id: 'info' as const, label: 'Informações', icon: Info },
  ]

  return (
    <div className="relative flex px-4 bg-neutral-950 sticky top-0 z-10">
      <div className="flex gap-1 relative z-10">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-all duration-200",
              "whitespace-nowrap relative",
              tab.disabled
                ? "opacity-40 cursor-not-allowed border-b-2 border-transparent"
                : activeTab === tab.id
                  ? "text-white border-b-2 border-white"
                  : "text-neutral-500 hover:text-white border-b-2 border-transparent"
            )}
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}