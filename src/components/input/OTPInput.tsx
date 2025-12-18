'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value: string[]
  onChange: (otp: string[]) => void
  length?: number
  className?: string
}

export function OTPInput({ value, onChange, length = 6, className }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return

    const newOtp = [...value]
    newOtp[index] = inputValue.slice(-1)
    onChange(newOtp)

    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className={cn('flex gap-3 justify-center', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={cn(
            'w-12 h-14 text-center text-2xl font-bold',
            'bg-transparent border-b-2 border-gray-700',
            'text-[#2A9E8B] focus:outline-none focus:border-[#2A9E8B]',
            'transition-all duration-200 animate-slide-up'
          )}
          style={{ animationDelay: `${0.3 + index * 0.05}s` }}
        />
      ))}
    </div>
  )
}
