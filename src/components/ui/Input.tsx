'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg bg-transparent',
            'border border-gray-700 text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-[#2A9E8B] focus:border-transparent',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <span className="flex items-center gap-2 text-red-500 text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 11.59 4.41 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5ZM7.25 5C7.25 4.59 7.59 4.25 8 4.25C8.41 4.25 8.75 4.59 8.75 5V8.5C8.75 8.91 8.41 9.25 8 9.25C7.59 9.25 7.25 8.91 7.25 8.5V5ZM8.75 11.25C8.75 11.66 8.41 12 8 12C7.59 12 7.25 11.66 7.25 11.25C7.25 10.84 7.59 10.5 8 10.5C8.41 10.5 8.75 10.84 8.75 11.25Z" fill="currentColor"/>
            </svg>
            {error}
          </span>
        )}
        {helperText && !error && (
          <span className="text-gray-400 text-sm">{helperText}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
