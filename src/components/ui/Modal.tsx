'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

export function Modal({ isOpen, onClose, children, className, showCloseButton = true }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-sm animate-fade-in"
      />
      
      <div className={cn(
        'relative bg-[#0a1a1f] rounded-2xl shadow-2xl',
        'max-w-5xl w-full max-h-[90vh] overflow-hidden',
        'animate-fade-in',
        className
      )}>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-110 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
