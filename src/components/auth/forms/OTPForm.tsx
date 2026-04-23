'use client'

import { useState } from 'react'
import { OTPInput } from '@/components/auth/input/OTPInput'
import { ResendButton } from '@/components/auth/button/ResendButton'
import { SubmitOTPButton } from '@/components/auth/button/SubmitOTPButton'
import { requestLoginOtp, verifyOtp } from '@/actions/auth'

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
      const result = await requestLoginOtp(phoneNumber)
      if (!result.ok) {
        setError(result.message || 'Failed to resend OTP')
        return
      }

      if (!result.data.success) {
        setError(result.data.error || 'Failed to resend OTP')
      }
    } catch {
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
      const result = await verifyOtp(phoneNumber, otpValue)
      if (!result.ok) {
        setError(result.message || 'Invalid OTP. Please try again')
        setOtp(Array(6).fill(''))
        return
      }

      const data = result.data

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Invalid OTP. Please try again')
        setOtp(Array(6).fill(''))
      }
    } catch {
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
