'use client'

import { useState, useRef, useEffect } from 'react'

interface MobileMenuButtonProps {
  userName?: string
  userInitial?: string
  expirationDate?: string
}

export function MobileMenuButton({ userName = 'Guest', userInitial = 'G', expirationDate = '00 MM YYYY' }: MobileMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-[#0a0e14] rounded-lg shadow-2xl border border-[#2A9E8B]/30 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 bg-gradient-to-br from-[#2A9E8B] to-[#1a7a6b] border-b border-[#2A9E8B]/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-semibold text-xl shadow-lg">
                {userInitial}
              </div>
              <div>
                <div className="text-white font-semibold">{userName}</div>
                <div className="text-white/80 text-sm">Membership expiring on {expirationDate}</div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2A9E8B]/20">
            <button
              onClick={() => {
                window.location.href = '/api/logout'
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#2A9E8B]/20 transition-all duration-300 w-full group"
            >
              <svg className="w-5 h-5 text-[#2A9E8B] transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-white font-medium group-hover:text-[#2A9E8B] transition-colors duration-300">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
