'use client'

import { motion } from 'framer-motion'
import { Music2, FileText, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlbumTabsProps {
  activeTab: 'tracklist' | 'files' | 'social'
  onChange: (tab: 'tracklist' | 'files' | 'social') => void
  projectColor: string
  trackCount: number
}

export function AlbumTabs({ activeTab, onChange, projectColor, trackCount }: AlbumTabsProps) {
  const tabs = [
    { id: 'tracklist' as const, label: 'Tracklist', icon: Music2, count: trackCount },
    { id: 'files' as const, label: 'Arquivos', icon: FileText },
    { id: 'social' as const, label: 'Social', icon: MessageSquare },
  ]

  return (
    <div className="relative flex px-4 bg-neutral-950 sticky top-0 z-10">
      <div className="flex gap-1 relative z-10">
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-all duration-200",
              "whitespace-nowrap relative",
              activeTab === tab.id
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-white border-b-2 border-transparent"
            )}
            style={{
              backgroundColor: 'transparent',
            }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
                style={{ backgroundColor: projectColor, color: '#000' }}>
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}