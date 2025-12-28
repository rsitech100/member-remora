'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LoginModal } from '@/components/auth/modal/LoginModal'
import { OTPModal } from '@/components/auth/modal/OTPModal'
import { ExpiredModal } from '@/components/auth/modal/ExpiredModal'

export function Auth() {
  const [step, setStep] = useState<'login' | 'otp' | 'expired'>('login')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isPending, startTransition] = useTransition()
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

  const handleOTPSuccess = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      
      if (data.success && data.data?.user?.role) {
        const role = data.data.user.role
        
        if (role === 'admin' || role === 'superadmin') {
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

  const handleClose = () => {
    startTransition(() => {
      setStep('login')
    })
  }

  return (
    <>
      <LoginModal
        isOpen={step === 'login'}
        onClose={handleClose}
        onSuccess={handleLoginSuccess}
        onExpired={handleLoginExpired}
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
