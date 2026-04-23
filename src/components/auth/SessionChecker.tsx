'use client'

import { useEffect, useRef } from 'react'
import { getMemberLoginUrl } from '@/lib/config'
import { fetchDashboardRole } from '@/actions/auth'

export function SessionChecker() {
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
        await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      } finally {
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        window.location.href = getMemberLoginUrl()
      }
    }

    const checkSession = async () => {
      if (isLoggingOut.current || hasRedirected.current) {
        return
      }

      try {
        const result = await fetchDashboardRole()
        if (!result.ok && result.auth) {
          await handleLogout()
          return
        }
      } catch {
      }
    }

    checkSession()

    const intervalId = setInterval(checkSession, 20000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return null
}
