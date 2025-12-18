'use client'

import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ExpandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isExpanded: boolean
}

export function ExpandButton({ isExpanded, className, ...props }: ExpandButtonProps) {
  return (
    <button
      className={cn(
        'p-1 rounded transition-transform duration-200',
        'hover:bg-white/10',
        isExpanded && 'rotate-90',
        className
      )}
      {...props}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
