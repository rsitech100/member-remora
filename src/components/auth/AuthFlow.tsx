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

  const handleOTPSuccess = () => {
    window.location.href = '/dashboard'
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
