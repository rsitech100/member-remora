'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function SessionChecker() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          redirect: 'manual' // Don't follow redirects automatically
        })
        
        // Handle 307 redirect, 401 unauthorized, or 500 server error
        if (response.type === 'opaqueredirect' || response.status === 307 || response.status === 401 || response.status === 500) {
          await fetch('/api/logout', { method: 'POST' }).catch(() => {})
          router.push('/login')
        }
      } catch (error) {
        console.error('Session check error:', error)
        await fetch('/api/logout', { method: 'POST' }).catch(() => {})
        router.push('/login')
      }
    }

    checkSession()

    const intervalId = setInterval(checkSession, 10000)

    return () => clearInterval(intervalId)
  }, [router])

  return null
}
