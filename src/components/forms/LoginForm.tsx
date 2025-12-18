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
    
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+62${phoneNumber.replace(/^0/, '')}`
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: formattedPhone }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.message?.toLowerCase().includes('expired') || data.error?.toLowerCase().includes('expired')) {
          onExpired()
        } else {
          onSuccess(formattedPhone)
        }
      } else {
        setError(data.message || data.error || 'Login failed. Please try again')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please check your connection and try again')
    } finally {
      setIsLoading(false)
    }
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
