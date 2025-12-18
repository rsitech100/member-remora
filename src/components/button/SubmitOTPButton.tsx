'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SubmitOTPButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function SubmitOTPButton({ isLoading, className, children, ...props }: SubmitOTPButtonProps) {
  return (
    <button
      className={cn(
        'w-full px-6 py-3 rounded-lg font-medium',
        'bg-[#2A9E8B] hover:bg-[#248276] text-white',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? 'Verifying...' : children}
    </button>
  )
}
