'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface RegisterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function RegisterButton({ isLoading, className, children, ...props }: RegisterButtonProps) {
  return (
    <button
      className={cn(
        'w-full px-6 py-3 rounded-lg font-medium',
        'bg-[#2A9E8B] hover:bg-[#248276] text-white',
        'transition-all duration-200',
        'flex items-center justify-center gap-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {children}
    </button>
  )
}
