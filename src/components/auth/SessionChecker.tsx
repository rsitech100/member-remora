'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function SessionChecker() {
  const router = useRouter()
  const isLoggingOut = useRef(false)
  const hasRedirected = useRef(false)

  useEffect(() => {
    const handleLogout = async () => {
      if (isLoggingOut.current || hasRedirected.current) {
        return
      }
      
      isLoggingOut.current = true
      hasRedirected.current = true
      
      try {
        await fetch('/api/logout', { method: 'POST' }).catch(() => {})
      } finally {
        window.location.href = '/login'
      }
    }

    const checkSession = async () => {
      if (isLoggingOut.current || hasRedirected.current) {
        return
      }

      try {
        const response = await fetch('/api/dashboard', {
          redirect: 'manual',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        const isAuthError = response.type === 'opaqueredirect' || 
                           response.status === 307 || 
                           response.status === 401 ||
                           response.status === 403
        
        if (isAuthError) {
          await handleLogout()
          return
        }

        if (response.ok) {
          const data = await response.json()
          if (!data.success || data.message?.toLowerCase().includes('unauthorized') || 
              data.message?.toLowerCase().includes('invalid token') ||
              data.message?.toLowerCase().includes('session expired')) {
            await handleLogout()
          }
        } else if (response.status >= 400) {
          await handleLogout()
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    }

    checkSession()

    const intervalId = setInterval(checkSession, 20000)

    return () => {
      clearInterval(intervalId)
    }
  }, [router])

  return null
}
