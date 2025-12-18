'use client'

import { RegisterButton } from '@/components/button/RegisterButton'

interface ExpiredContentProps {
  onRegister: () => void
}

export function ExpiredContent({ onRegister }: ExpiredContentProps) {
  return (
    <RegisterButton
      onClick={onRegister}
      className="animate-slide-up"
      style={{ animationDelay: '0.2s' }}
    >
      Daftar Sekarang
    </RegisterButton>
  )
}
