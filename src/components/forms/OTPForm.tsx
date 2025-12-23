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
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.some(digit => !digit)) {
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const otpCode = otp.join('')
      
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone_number: phoneNumber, 
          verification_code: otpCode 
        }),
      })

      const data = await response.json()

      if (data.success && data.data?.token) {
        onSuccess()
      } else {
        setError(data.message || data.error || 'Invalid OTP. Please try again')
        setOtp(['', '', '', '', '', ''])
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      setError('Network error. Please try again')
      setOtp(['', '', '', '', '', ''])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setOtp(['', '', '', '', '', ''])
    setError('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      setError('Failed to resend OTP. Please try again')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-12">
      <OTPInput value={otp} onChange={setOtp} />
      
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <ResendButton onResend={handleResend} className="text-sm" />

      <SubmitOTPButton
        type="submit"
        isLoading={isLoading}
        disabled={otp.some(digit => !digit)}
      >
        Login
      </SubmitOTPButton>
    </form>
  )
}
