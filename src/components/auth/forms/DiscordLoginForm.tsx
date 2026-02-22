'use client'

import { useState } from 'react'

interface DiscordLoginFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function DiscordLoginForm({ onSuccess, onError }: DiscordLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDiscordLogin = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/discord?redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/discord/callback'))
      const data = await response.json()

      if (!data.success || !data.data?.auth_url) {
        onError(data.message || 'Failed to initiate Discord login')
        setIsLoading(false)
        return
      }

      const authUrl = data.data.auth_url
      const state = data.data.state

      sessionStorage.setItem('discord_oauth_state', state)

      const width = 500
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      const popup = window.open(
        authUrl,
        'discord-oauth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
      )

      if (!popup) {
        window.location.href = authUrl
        return
      }

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data?.type === 'discord-oauth-callback') {
          window.removeEventListener('message', handleMessage)
          clearInterval(pollTimer)
          popup.close()

          if (event.data.success) {
            if (event.data.token) {
              try {
                const response = await fetch('/api/auth/set-token', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token: event.data.token }),
                })
                const data = await response.json()
              } catch (error) {
              }
            }
            onSuccess()
          } else {
            onError(event.data.error || 'Discord authentication failed')
            setIsLoading(false)
          }
        }
      }

      window.addEventListener('message', handleMessage)

      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer)
          window.removeEventListener('message', handleMessage)
          setIsLoading(false)
        }
      }, 500)
    } catch (error) {
      onError('Failed to connect to Discord. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleDiscordLogin}
        disabled={isLoading}
        className="w-full px-6 py-3.5 rounded-lg font-medium bg-[#2A9E8B] hover:bg-[#248276] text-white transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Connecting to Discord...</span>
          </>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.8732.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
            </svg>
            <span>Login with Discord</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500">
        You will be redirected to Discord to authorize access
      </p>
    </div>
  )
}
