'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    // Base styles using design tokens
    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "active:scale-[0.98]",
      // Transitions from tokens
      "trans-colors trans-transform"
    )

    // Variant styles using semantic color tokens
    const variants = {
      primary: "bg-white text-black hover:bg-white/90 shadow-sm",
      secondary: "bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700",
      ghost: "bg-transparent hover:bg-neutral-800 text-white",
      danger: "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30",
      outline: "border border-neutral-700 bg-transparent hover:bg-neutral-800",
    }

    // Size styles using design token values
    const sizes = {
      sm: "h-[var(--btn-height-sm)] px-[var(--btn-padding-x-sm)] text-xs rounded-[var(--btn-radius)] gap-sm",
      md: "h-[var(--btn-height-md)] px-[var(--btn-padding-x-md)] text-sm rounded-[var(--btn-radius)] gap-md",
      lg: "h-[var(--btn-height-lg)] px-[var(--btn-padding-x-lg)] text-base rounded-[var(--btn-radius)] gap-md",
      icon: "h-[var(--btn-height-icon)] w-[var(--btn-height-icon)] rounded-[var(--btn-radius)]",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }