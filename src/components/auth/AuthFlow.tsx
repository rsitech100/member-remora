'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginModal } from './LoginModal'
import { OTPModal } from './OTPModal'
import { ExpiredModal } from './ExpiredModal'

export function AuthFlow() {
  const [step, setStep] = useState<'login' | 'otp' | 'expired' | null>('login')
  const [phoneNumber, setPhoneNumber] = useState('')
  const router = useRouter()

  const handleLoginSuccess = (phone: string) => {
    setPhoneNumber(phone)
    setStep('otp')
  }

  const handleLoginExpired = () => {
    setStep('expired')
  }

  const handleOTPSuccess = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      if (data.success && data.data?.user?.role) {
        const role = data.data.user.role
        
        if (role === 'admin' || role === 'superadmin') {
          window.location.href = '/admin'
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      window.location.href = '/dashboard'
    }
  }

  const handleClose = () => {
    setStep('login')
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
