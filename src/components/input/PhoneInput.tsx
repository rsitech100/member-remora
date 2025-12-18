'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          type="tel"
          className={cn(
            'w-full px-4 py-3 bg-transparent border-b-2 border-gray-700',
            'text-white placeholder:text-gray-500',
            'focus:outline-none focus:border-[#2A9E8B] transition-colors',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'
