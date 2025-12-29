'use client'

import { useEffect } from 'react'
import { Icon } from './Icon'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-[#2A9E8B]/90 border-[#2A9E8B]',
    error: 'bg-red-500/90 border-red-400',
    warning: 'bg-amber-500/90 border-amber-400',
    info: 'bg-blue-500/90 border-blue-400',
  }

  const icons = {
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  return (
    <div
      className={`
        flex items-center gap-3
        min-w-[320px] max-w-md
        px-4 py-3
        rounded-lg border-2
        shadow-2xl backdrop-blur-sm
        text-white font-medium
        animate-in slide-in-from-top-2 duration-300
        ${typeStyles[type]}
      `}
    >
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={icons[type]}
        />
      </svg>
      
      <p className="flex-1 text-sm leading-relaxed">{message}</p>
      
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
