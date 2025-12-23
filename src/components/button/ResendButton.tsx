'use client'

import { useEffect, useState } from 'react'

interface ResendButtonProps {
  onResend: () => void
  initialCountdown?: number
  className?: string
}

export function ResendButton({ onResend, initialCountdown = 300, className }: ResendButtonProps) {
  const [countdown, setCountdown] = useState(initialCountdown)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])

  const handleResend = () => {
    setCountdown(initialCountdown)
    onResend()
  }

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className={className}>
      {countdown > 0 ? (
        <p className="text-white text-sm text-center md:text-left">
          Belum mendapatkan kode?{' '}
          <span className="text-gray-500">Kirim ulang dalam {timeDisplay}</span>
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-white text-sm w-full md:w-auto text-center md:text-left"
        >
          Belum mendapatkan kode? <span className="text-[#2A9E8B] underline hover:text-[#248276] transition-colors">Kirim ulang</span>
        </button>
      )}
    </div>
  )
}
