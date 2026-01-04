'use client'

import { useState } from 'react'
import { LoginInput } from '@/components/auth/input/LoginInput'
import { LoginButton } from '@/components/auth/button/LoginButton'

interface LoginFormProps {
  onSuccess: (phoneNumber: string) => void
  onExpired: () => void
}

export function LoginForm({ onSuccess, onExpired }: LoginFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validatePhoneNumber = (value: string): string => {
    if (!value) return ''
    
    const cleanPhone = value.replace(/\D/g, '')
    
    if (value.startsWith('+')) {
      if (value.length === 1) return ''
      if (!value.startsWith('+62')) {
        return 'Country code must be +62'
      }
      if (value.length > 3) {
        const digitCount = cleanPhone.length - 2 
        if (digitCount > 13) {
          return 'Phone number too long (max 13 digits after +62)'
        }
      }
    } else if (value.startsWith('0')) {
      if (cleanPhone.length > 14) {
        return 'Phone number too long (max 14 digits)'
      }
    } else if (value.startsWith('62')) {
      if (cleanPhone.length > 15) {
        return 'Phone number too long (max 13 digits after 62)'
      }
    }
    
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber) {
      setError('Please enter your phone number')
      return
    }

    const validationError = validatePhoneNumber(phoneNumber)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        onSuccess(phoneNumber)
      } else {
        if (data.expired || data.status === 403 || data.error === 'expired_subscription' || data.message?.toLowerCase().includes('expired')) {
          onExpired()
        } else {
          let errorMessage = 'Invalid phone number. Please try again'
          
          if (data.details) {
            try {
              const parsedDetails = JSON.parse(data.details)
              errorMessage = parsedDetails.error || parsedDetails.message || errorMessage
            } catch {
              errorMessage = data.error || data.message || errorMessage
            }
          } else {
            errorMessage = data.error || data.message || errorMessage
          }
          
          setError(errorMessage)
        }
      }
    } catch (error) {
      setError('Invalid phone number. Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <LoginInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => {
          const value = e.target.value
          if (value === '' || /^[\+]?[0-9]*$/.test(value)) {
            setPhoneNumber(value)
            const validationError = validatePhoneNumber(value)
            setError(validationError)
          }
        }}
        error={error}
      />

      <LoginButton type="submit" isLoading={isLoading}>
        Login
      </LoginButton>
    </form>
  )
}
