'use client'

import { cn } from '@/lib/utils'

interface AppIconProps {
  size?: number | string
  className?: string
  alt?: string
}

export function AppIcon({ size = 24, className, alt = 'Arqchives' }: AppIconProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size
  
  return (
    <img
      src="/icon.png"
      alt={alt}
      className={cn('object-contain', className)}
      style={{ width: sizeValue, height: sizeValue }}
    />
  )
}

// Versão para usar como favicon/logo maior
export function AppIconLarge({ size = 48, className }: { size?: number | string; className?: string }) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size
  
  return (
    <img
      src="/icon.png"
      alt="Arqchives"
      className={cn('object-contain drop-shadow-lg', className)}
      style={{ width: sizeValue, height: sizeValue }}
    />
  )
}