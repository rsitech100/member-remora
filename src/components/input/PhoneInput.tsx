'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          pattern="[\+]?[0-9]*"
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2',
            'bg-transparent text-white placeholder:text-gray-500',
            'focus:outline-none transition-colors',
            error 
              ? 'border-red-500 focus:border-red-500' 
              : 'border-gray-700 focus:border-[#2A9E8B]',
            className
          )}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V8M8 11V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
