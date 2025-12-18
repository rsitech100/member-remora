'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function MessageButton() {
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
        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/80 hover:text-white relative"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-slide-up bg-[#0f1419]">
          <div className="p-6">
            <h3 className="text-white font-bold text-xl mb-4">Messages</h3>
            <div className="bg-gradient-to-br from-[#1a2332] to-[#0d1820] rounded-xl p-8 text-center border border-[#2A9E8B]/20">
              <p className="text-gray-300">You have<br/>no<br/>messages<br/>yet</p>
            </div>
          </div>
          
          <button className="w-full bg-[#0d1820] hover:bg-[#1a2332] transition-colors py-3 flex items-center justify-center gap-2 text-white border-t border-white/10">
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
