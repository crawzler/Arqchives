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
        'fixed top-[68px] h-[calc(100vh-68px)] flex flex-col trans-all z-fixed',
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
            'absolute top-0 bottom-0 w-[4px] flex items-center justify-center trans-colors select-none',
            'hover:bg-default hover:w-[6px]',
            isResizing && 'bg-muted/50 w-[6px]',
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
            <GripVertical className="w-3 h-6 text-muted hover:text-primary trans-colors opacity-50 hover:opacity-100" />
          )}
        </div>
      )}

      {/* Collapse/Expand Button - at top of panel, inside content area */}
      {showCollapseButton && onCollapseChange && !collapsed && (
        <button
          onClick={handleCollapseClick}
          className={cn(
            'absolute top-sm z-modal w-8 h-8 radius-lg bg-base border border-subtle flex items-center justify-center text-muted hover:text-primary hover:bg-hover trans-all',
            position === 'left'
              ? 'right-sm'
              : 'left-sm'
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
            'absolute top-sm z-modal w-8 h-8 radius-lg bg-base border border-subtle flex items-center justify-center text-muted hover:text-primary hover:bg-hover trans-all',
            position === 'left'
              ? 'left-sm'
              : 'right-sm'
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
        'flex-1 overflow-hidden flex flex-col trans-opacity',
        collapsed && 'opacity-0 pointer-events-none'
      )}>
        {children}
      </div>
    </div>
  )
}