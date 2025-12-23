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
        return 'Phone number too long (max 15 digits)'
      }
    } else if (value.length > 0) {
      return 'Phone number must start with 0, 62, or +62'
    }
    
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validatePhoneNumber(phoneNumber)
    if (validationError) {
      setError(validationError)
      return
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '')
    
    if (phoneNumber.startsWith('+')) {
      if (!/^\+62\d{9,13}$/.test(phoneNumber)) {
        setError('Phone number must be in format +62XXXXXXXXX (9-13 digits)')
        return
      }
    } else if (phoneNumber.startsWith('0')) {
      if (cleanPhone.length < 10 || cleanPhone.length > 14) {
        setError('Phone number must be 10-14 digits')
        return
      }
    } else if (phoneNumber.startsWith('62')) {
      if (cleanPhone.length < 11 || cleanPhone.length > 15) {
        setError('Phone number must be 11-15 digits (including country code)')
        return
      }
    } else {
      setError('Phone number must start with 0, 62, or +62')
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
        onSuccess(formattedPhone)
      } else {
        if (data.error === 'expired_subscription' || data.message?.toLowerCase().includes('expired')) {
          onExpired()
        } else {
          setError('Invalid phone number. Please try again')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Invalid phone number. Please try again')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PhoneInput
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
