'use client'

import { useState } from 'react'
import { OTPInput } from '@/components/auth/input/OTPInput'
import { ResendButton } from '@/components/auth/button/ResendButton'
import { SubmitOTPButton } from '@/components/auth/button/SubmitOTPButton'

interface OTPFormProps {
  phoneNumber: string
  onSuccess: () => void
}

export function OTPForm({ phoneNumber, onSuccess }: OTPFormProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleResend = async () => {
    setError('')
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to resend OTP')
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone_number: phoneNumber, 
          verification_code: otpValue 
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Invalid OTP. Please try again')
        setOtp(Array(6).fill(''))
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setError('Invalid OTP. Please try again')
      setOtp(Array(6).fill(''))
    } finally {
      setIsLoading(false)
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
