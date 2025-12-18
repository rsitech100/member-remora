'use client'

import { useState } from 'react'
import { OTPInput } from '@/components/input/OTPInput'
import { ResendButton } from '@/components/button/ResendButton'
import { SubmitOTPButton } from '@/components/button/SubmitOTPButton'

interface OTPFormProps {
  phoneNumber: string
  onSuccess: () => void
}

export function OTPForm({ phoneNumber, onSuccess }: OTPFormProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.some(digit => !digit)) {
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      
      const otpCode = otp.join('')
      
      if (phoneNumber === '08987654321' && otpCode === '123456') {
        onSuccess()
      } else {
        setOtp(['', '', '', '', '', ''])
      }
    }, 1000)
  }

  const handleResend = () => {
    setOtp(['', '', '', '', '', ''])
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <OTPInput value={otp} onChange={setOtp} />

      <ResendButton onResend={handleResend} className="text-center text-sm" />

      <SubmitOTPButton
        type="submit"
        isLoading={isLoading}
        disabled={otp.some(digit => !digit)}
      >
        Verifikasi
      </SubmitOTPButton>
    </form>
  )
}
