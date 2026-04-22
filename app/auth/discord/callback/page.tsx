'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RemoraLogo } from '@/components/ui/Icon'

function DiscordCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Authenticating with Discord...')

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash.substring(1)
      const hashParams = new URLSearchParams(hash)
      const token = hashParams.get('token')

      if (token) {
        setStatus('success')
        setMessage('Login successful! Redirecting...')
        postMessageToOpener(true, '', token)
        return
      }

      const error = hashParams.get('error')
      if (error) {
        setStatus('error')
        setMessage(decodeURIComponent(error))
        postMessageToOpener(false, decodeURIComponent(error))
        return
      }

      const code = searchParams.get('code') 
      const state = searchParams.get('state')

      if (!code || !state) {
        setStatus('error')
        setMessage('Missing authorization parameters')
        postMessageToOpener(false, 'Missing authorization parameters')
        return
      }

      try {
        const response = await fetch(
          `/api/auth/discord/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`
        )
        const data = await response.json()

        if (data.success && data.data?.token) {
          setStatus('success')
          setMessage('Login successful! Redirecting...')
          postMessageToOpener(true, '', data.data.token)
        } else {
          const errorMsg = data.message || 'Discord authentication failed'
          setStatus('error')
          setMessage(errorMsg)
          postMessageToOpener(false, errorMsg)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Failed to complete authentication')
        postMessageToOpener(false, 'Failed to complete authentication')
      }
    }

    handleCallback()
  }, [searchParams])

  async function postMessageToOpener(success: boolean, error?: string, token?: string) {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'discord-oauth-callback',
          success,
          error,
          token,
        },
        window.location.origin
      )

      setTimeout(() => {
        window.close()
      }, 1500)
    } else {
      if (success && token) {
        try {
          const res = await fetch('/api/dashboard', {
            credentials: 'include',
            headers: { 'Cache-Control': 'no-cache' },
          })
          const data = await res.json()
          if (data.success && (data.data?.user?.role === 'admin' || data.data?.user?.role === 'superadmin')) {
            setTimeout(() => {
              window.location.href = '/admin'
            }, 1000)
            return
          }
        } catch {
        }
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-4">
      <div className="bg-[#0a1a1f] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/5">
        <div className="flex justify-center mb-6">
          <RemoraLogo width={50} height={50} />
        </div>

        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-3 border-[#2A9E8B]/20 border-t-[#2A9E8B] animate-spin" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Authenticating</h2>
            <p className="text-sm text-gray-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#2A9E8B]/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#2A9E8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-[#2A9E8B] mb-2">Success!</h2>
            <p className="text-sm text-gray-400">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-red-400 mb-2">Authentication Failed</h2>
            <p className="text-sm text-gray-400">{message}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default function DiscordCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center p-4">
          <div className="bg-[#0a1a1f] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/5">
            <div className="flex justify-center mb-6">
              <RemoraLogo width={50} height={50} />
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full border-3 border-[#2A9E8B]/20 border-t-[#2A9E8B] animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Loading...</h2>
          </div>
        </div>
      }
    >
      <DiscordCallbackContent />
    </Suspense>
  )
}
