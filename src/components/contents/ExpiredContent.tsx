'use client'

import { RegisterButton } from '@/components/button/RegisterButton'

export function ExpiredContent() {
  const handleRegister = () => {
    window.open('https://remoratrader.id', '_blank', 'noopener,noreferrer')
  }

  return (
    <RegisterButton
      onClick={handleRegister}
      className="animate-slide-up"
      style={{ animationDelay: '0.2s' }}
    >
      Daftar Sekarang
    </RegisterButton>
  )
}
