'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginModal } from '@/components/auth/modal/LoginModal'
import { OTPModal } from '@/components/auth/modal/OTPModal'
import { ExpiredModal } from '@/components/auth/modal/ExpiredModal'

export function Auth() {
  const [step, setStep] = useState<'login' | 'otp' | 'expired'>('login')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const expired = searchParams.get('expired')
    if (expired === 'true') {
      setStep('expired')
    }
  }, [searchParams])

  const handleLoginSuccess = (phone: string) => {
    startTransition(() => {
      setPhoneNumber(phone)
      setStep('otp')
    })
  }

  const handleLoginExpired = () => {
    startTransition(() => {
      setStep('expired')
    })
  }

  const redirectToDashboard = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()

      if (data.success && data.data?.user?.role) {
        const role = data.data.user.role

        if (role === 'admin' || role === 'superadmin') {
          const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL
          if (adminAppUrl) {
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('auth_token='))
              ?.split('=')[1]
            
            if (token) {
              window.location.href = `${adminAppUrl}/api/auth/set-token-redirect?token=${encodeURIComponent(token)}&redirect=/admin`
              return
            }
          }
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      router.push('/dashboard')
    }
  }

  const handleOTPSuccess = async () => {
    await redirectToDashboard()
  }

  const handleDiscordSuccess = async () => {
    await redirectToDashboard()
  }

  const handleClose = () => {
    startTransition(() => {
      setStep('login')
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('error')
        url.searchParams.delete('expired')
        window.history.replaceState({}, '', url.pathname)
      }
    })
  }

  return (
    <>
      <LoginModal
        isOpen={step === 'login'}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
        onExpired={handleLoginExpired}
        onDiscordSuccess={handleDiscordSuccess}
      />
      
      <OTPModal
        isOpen={step === 'otp'}
        onClose={handleClose}
        phoneNumber={phoneNumber}
        onSuccess={handleOTPSuccess}
      />
      
      <ExpiredModal
        isOpen={step === 'expired'}
        onClose={handleClose}
      />
    </>
  )
}
