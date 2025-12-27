'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function SessionChecker() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
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
          await fetch('/api/logout', { method: 'POST' }).catch(() => {})
          router.push('/login')
          return
        }

        if (response.ok) {
          const data = await response.json()
          if (!data.success || data.message?.toLowerCase().includes('unauthorized') || 
              data.message?.toLowerCase().includes('invalid token')) {
            await fetch('/api/logout', { method: 'POST' }).catch(() => {})
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
        await fetch('/api/logout', { method: 'POST' }).catch(() => {})
        router.push('/login')
      }
    }

    checkSession()

    const intervalId = setInterval(checkSession, 20000)

    return () => clearInterval(intervalId)
  }, [router])

  return null
}
