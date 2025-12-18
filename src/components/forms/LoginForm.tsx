'use client'

import { useState } from 'react'
import { PhoneInput } from '@/components/input/PhoneInput'
import { LoginButton } from '@/components/button/LoginButton'

interface LoginFormProps {
  onSuccess: (phoneNumber: string) => void
  onExpired: () => void
}

export function LoginForm({ onSuccess, onExpired }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Invalid phone number. Please try again')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)
      
      if (phoneNumber === '089876543211') {
        onExpired()
      } else {
        onSuccess(phoneNumber)
      }
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <PhoneInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value)
          setError('')
        }}
        error={error}
      />

      <LoginButton type="submit" isLoading={isLoading}>
        Login
      </LoginButton>
    </form>
  )
}
