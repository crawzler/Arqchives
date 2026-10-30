'use client'

import { useWindowControls } from '@/hooks/useElectron'
import { Minus, Square, X } from 'lucide-react'
import { AppIcon } from '@/components/ui/AppIcon'

export default function TitleBar() {
  const { minimize, maximize, close } = useWindowControls()

  return (
    <header className="h-10 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between select-none drag-region">
      {/* Logo / Título */}
      <div className="flex items-center px-4 gap-2 no-drag-region">
        <AppIcon size={16} />
        <span className="text-xs font-bold tracking-tight text-neutral-300">ARQCHIVES</span>
      </div>

      {/* Controles da Janela */}
      <div className="flex items-center no-drag-region h-full gap-1 pr-2">
        <button
          onClick={minimize}
          className="w-12 h-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
          title="Minimizar"
        >
          <Minus className="w-3.5 h-3.5 text-neutral-400" />
        </button>
        <button
          onClick={maximize}
          className="w-12 h-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
          title="Maximizar"
        >
          <Square className="w-3 h-3 text-neutral-400" />
        </button>
        <button
          onClick={close}
          className="w-12 h-full flex items-center justify-center hover:bg-red-600 group transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4 text-neutral-400 group-hover:text-white" />
        </button>
      </div>

      <style>{`
        .drag-region { -webkit-app-region: drag; }
        .no-drag-region { -webkit-app-region: no-drag; }
      `}</style>
    </header>
  )
}