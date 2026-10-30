'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-caption font-medium text-secondary mb-xs">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-neutral-900 text-white placeholder:text-neutral-500",
            // Tokens for sizing & radius
            "h-[var(--input-height)] px-[var(--input-padding-x)] rounded-[var(--input-radius)] text-sm",
            // Borders using semantic tokens
            "border border-default",
            // Transitions from tokens
            "trans-colors",
            // Focus states
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-focus",
            // Hover
            "hover:border-strong",
            // Disabled
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Error states
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-xs text-caption text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }