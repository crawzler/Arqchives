'use client'

import { useWindowControls } from '@/hooks/useElectron'
import { Minus, Square, X } from 'lucide-react'
import { AppIcon } from '@/components/ui/AppIcon'

export default function TitleBar() {
  const { minimize, maximize, close } = useWindowControls()

  return (
    <header className="h-10 bg-base border-b border-subtle flex items-center justify-between select-none drag-region">
      {/* Logo / Título */}
      <div className="flex items-center px-lg gap-sm no-drag-region">
        <AppIcon size={16} />
        <span className="text-caption font-bold tracking-tight text-secondary">ARQCHIVES</span>
      </div>

      {/* Controles da Janela */}
      <div className="flex items-center no-drag-region h-full gap-xs pr-sm">
        <button
          onClick={minimize}
          className="w-12 h-full flex items-center justify-center hover:bg-hover trans-colors focus-ring-inset"
          title="Minimizar"
        >
          <Minus className="w-3.5 h-3.5 text-muted" />
        </button>
        <button
          onClick={maximize}
          className="w-12 h-full flex items-center justify-center hover:bg-hover trans-colors focus-ring-inset"
          title="Maximizar"
        >
          <Square className="w-3 h-3 text-muted" />
        </button>
        <button
          onClick={close}
          className="w-12 h-full flex items-center justify-center hover:bg-red-600 group trans-colors focus-ring-inset"
          title="Fechar"
        >
          <X className="w-4 h-4 text-muted group-hover:text-primary" />
        </button>
      </div>

      <style>{`
        .drag-region { -webkit-app-region: drag; }
        .no-drag-region { -webkit-app-region: no-drag; }
      `}</style>
    </header>
  )
}