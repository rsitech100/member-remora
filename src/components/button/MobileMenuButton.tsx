'use client'

import { useState, useRef, useEffect } from 'react'

export function MobileMenuButton() {
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
        <div className="absolute left-0 top-full mt-2 w-64 bg-[#0f1419] rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2A9E8B] flex items-center justify-center text-white font-semibold text-xl">
                J
              </div>
              <div>
                <div className="text-white font-medium">Jay Park</div>
                <div className="text-gray-400 text-sm">Membership expiring on 00 MM YYYY</div>
              </div>
            </div>
          </div>

          <div className="py-2">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </a>
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
