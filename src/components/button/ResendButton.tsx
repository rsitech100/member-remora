'use client'

import { useEffect, useState } from 'react'

interface ResendButtonProps {
  onResend: () => void
  initialCountdown?: number
  className?: string
}

export function ResendButton({ onResend, initialCountdown = 30, className }: ResendButtonProps) {
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

  return (
    <div className={className}>
      {countdown > 0 ? (
        <p className="text-gray-400">
          Belum mendapatkan kode?{' '}
          <span className="text-gray-500">Kirim ulang dalam {countdown}s</span>
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-[#2A9E8B] hover:text-[#248276] transition-colors"
        >
          Belum mendapatkan kode? <span className="underline">Kirim ulang</span>
        </button>
      )}
    </div>
  )
}
