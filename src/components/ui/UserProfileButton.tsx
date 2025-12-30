'use client'

import { useState, useRef, useEffect } from 'react'

interface UserProfileButtonProps {
  userName: string
  userInitial: string
}

export function UserProfileButton({ userName, userInitial }: UserProfileButtonProps) {
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

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { 
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
    } catch (error) {
    }
    window.location.href = '/login'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-[#1a2733] hover:bg-[#1f2f3d] rounded-full pl-1 pr-4 py-1 transition-all duration-300 hover:shadow-lg hover:scale-105"
      >
        <div className="w-10 h-10 rounded-full bg-[#2A9E8B] flex items-center justify-center text-white font-semibold text-lg transition-transform duration-300 hover:scale-110">
          {userInitial}
        </div>
        <span className="text-white font-medium text-sm">{userName}</span>
        <svg className={`w-4 h-4 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <button
          onClick={handleLogout}
          className="absolute right-0 top-full mt-2 flex items-center gap-3 px-4 py-2.5 bg-[#2A9E8B] hover:bg-[#238174] transition-all duration-300 text-white rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-top-2 hover:shadow-2xl hover:scale-105 backdrop-blur-sm"
        >
          <svg className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      )}
    </div>
  )
}
