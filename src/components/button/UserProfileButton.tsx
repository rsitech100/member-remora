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

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-[#2A9E8B] flex items-center justify-center text-white font-semibold text-lg">
          {userInitial}
        </div>
        <span className="text-white font-medium">{userName}</span>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f1419] rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
          <div className="py-2">
            <a
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <span>👤</span>
              <span>Profile</span>
            </a>
            <a
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </a>
          </div>
          
          <div className="border-t border-white/10">
            <button
              onClick={() => {
                window.location.href = '/login'
              }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 w-full"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
