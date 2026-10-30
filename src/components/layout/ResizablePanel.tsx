'use client'

import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResizablePanelProps {
  /** Position of the panel */
  position: 'left' | 'right'
  /** Current width in pixels */
  width: number
  /** Minimum width */
  minWidth?: number
  /** Maximum width */
  maxWidth?: number
  /** Whether panel is collapsed */
  collapsed?: boolean
  /** Callback when width changes */
  onWidthChange: (width: number) => void
  /** Callback when collapsed state changes */
  onCollapseChange?: (collapsed: boolean) => void
  /** Panel content */
  children: React.ReactNode
  /** Panel background class - defaults to transparent, let children handle background */
  className?: string
  /** Show collapse button */
  showCollapseButton?: boolean
  /** Collapse button aria label */
  collapseAriaLabel?: string
  /** Expand button aria label */
  expandAriaLabel?: string
  /** Show resize handle - default true */
  showResizeHandle?: boolean
}

export function ResizablePanel({
  position,
  width,
  minWidth = 200,
  maxWidth = 600,
  collapsed = false,
  onWidthChange,
  onCollapseChange,
  children,
  className,
  showCollapseButton = true,
  collapseAriaLabel,
  expandAriaLabel,
  showResizeHandle = true,
}: ResizablePanelProps) {
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const rect = panelRef.current?.getBoundingClientRect()
      if (!rect) return

      let newWidth: number
      if (position === 'left') {
        newWidth = e.clientX - rect.left
      } else {
        newWidth = rect.right - e.clientX
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      onWidthChange(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, position, minWidth, maxWidth, onWidthChange])

  const handleCollapseClick = () => {
    onCollapseChange?.(!collapsed)
  }

  const effectiveWidth = collapsed ? 0 : width

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed top-[68px] h-[calc(100vh-68px)] flex flex-col transition-all duration-200 z-40',
        position === 'left'
          ? 'left-0'
          : 'right-0',
        className
      )}
      style={{ width: `${effectiveWidth}px` }}
      role="region"
      aria-label={position === 'left' ? 'Painel lateral' : 'Playlist'}
    >
      {/* Resize Handle - positioned at the inner edge of the panel */}
      {showResizeHandle !== false && (
        <div
          ref={handleRef}
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute top-0 bottom-0 w-1 flex items-center justify-center transition-colors select-none',
            'hover:bg-neutral-800 hover:w-1.5',
            isResizing && 'bg-neutral-600 w-1.5',
            position === 'left' ? 'right-0 cursor-ew-resize' : 'left-0 cursor-ew-resize',
            collapsed && 'opacity-0 pointer-events-none'
          )}
          style={{
            left: position === 'left' ? undefined : 0,
            right: position === 'left' ? 0 : undefined,
          }}
          aria-label={position === 'left' ? 'Redimensionar painel lateral' : 'Redimensionar playlist'}
          role="separator"
          tabIndex={0}
          aria-orientation="vertical"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault()
              const direction = position === 'left' ? (e.key === 'ArrowRight' ? 1 : -1) : (e.key === 'ArrowLeft' ? 1 : -1)
              const newWidth = Math.max(minWidth, Math.min(maxWidth, width + direction * 10))
              onWidthChange(newWidth)
            }
          }}
        >
          {!collapsed && (
            <GripVertical className="w-3 h-6 text-neutral-500 hover:text-white transition-colors opacity-50 hover:opacity-100" />
          )}
        </div>
      )}

      {/* Collapse/Expand Button - at top of panel, inside content area */}
      {showCollapseButton && onCollapseChange && !collapsed && (
        <button
          onClick={handleCollapseClick}
          className={cn(
            'absolute top-2 z-50 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all',
            position === 'left'
              ? 'right-2'
              : 'left-2'
          )}
          aria-label={collapseAriaLabel || 'Colapsar painel'}
          aria-expanded="true"
        >
          {position === 'left' ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      )}

      {showCollapseButton && onCollapseChange && collapsed && (
        <button
          onClick={handleCollapseClick}
          className={cn(
            'absolute top-2 z-50 w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all',
            position === 'left'
              ? 'left-2'
              : 'right-2'
          )}
          aria-label={expandAriaLabel || 'Expandir painel'}
          aria-expanded="false"
        >
          {position === 'left' ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Panel Content */}
      <div className={cn(
        'flex-1 overflow-hidden flex flex-col transition-opacity duration-200',
        collapsed && 'opacity-0 pointer-events-none'
      )}>
        {children}
      </div>
    </div>
  )
}