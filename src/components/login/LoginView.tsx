'use client'

import { AuthFlow } from '@/components/auth/AuthFlow'
import Image from 'next/image'

export default function LoginView() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 w-screen h-screen">
        <Image
          src="/images/bg.png"
          alt="Background"
          fill
          className="object-cover object-top"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0" />
      </div>

      <AuthFlow />
    </div>
  )
}
