'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginModal } from '@/components/auth/modal/LoginModal'
import { OTPModal } from '@/components/auth/modal/OTPModal'
import { ExpiredModal } from '@/components/auth/modal/ExpiredModal'
import { fetchDashboardRole } from '@/actions/auth'

export function Auth() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'login' | 'otp' | 'expired'>(() =>
    searchParams.get('expired') === 'true' ? 'expired' : 'login'
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [, startTransition] = useTransition()
  const router = useRouter()

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
      const result = await fetchDashboardRole()
      if (!result.ok) {
        router.push('/dashboard')
        return
      }

      const role = result.data.role
      if (role === 'admin' || role === 'superadmin') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch {
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
