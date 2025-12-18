'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
}

export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'p-2 rounded-lg hover:bg-white/10 transition-colors',
        'text-white/80 hover:text-white',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  )
}
