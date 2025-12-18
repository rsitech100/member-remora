'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface UserMenuButtonProps {
  userName: string
  userHandle: string
  userImage?: string
}

export function UserMenuButton({ userName, userHandle, userImage }: UserMenuButtonProps) {
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

  const menuItems = [
    { icon: '👤', label: 'Profile', href: '/dashboard/profile' },
    { icon: '⚙️', label: 'Account', href: '/dashboard/account' },
    { icon: '📅', label: 'Timeline', href: '/dashboard/timeline' },
    { icon: '🔔', label: 'Notifications', href: '/dashboard/notifications' },
    { icon: '💬', label: 'Messages', href: '/dashboard/messages' },
    { icon: '🤝', label: 'Connections', href: '/dashboard/connections' },
    { icon: '👥', label: 'Groups', href: '/dashboard/groups' },
    { icon: '📚', label: 'Courses', href: '/dashboard/courses' },
    { icon: '💭', label: 'Forums', href: '/dashboard/forums' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
      >
        <span className="text-white font-medium hidden sm:block">{userName}</span>
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border-2 border-white/20">
          {userImage ? (
            <Image src={userImage} alt={userName} width={40} height={40} />
          ) : (
            <span className="text-white text-lg font-semibold">{userName[0].toLowerCase()}</span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f1419] rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center border-2 border-[#2A9E8B]/50">
                <span className="text-white text-xl font-semibold">{userName[0].toLowerCase()}</span>
              </div>
              <div>
                <div className="text-white font-medium">{userName}</div>
                <div className="text-gray-400 text-sm">{userHandle}</div>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-white/10">
            <button
              onClick={() => {
                window.location.href = '/login'
              }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors text-gray-300 hover:text-red-400 w-full"
            >
              <span className="text-lg">🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
