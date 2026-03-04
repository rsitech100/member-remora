'use client'

import { getMemberLoginUrl } from '@/lib/config'

export function LogoutButton() {
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
    // Clear cookie client-side as well (cookie is not httpOnly)
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = getMemberLoginUrl()
  }
  
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-[#2A9E8B] hover:bg-[#238174] text-white rounded-lg transition-colors shadow-lg"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  )
}
