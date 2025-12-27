import { Suspense } from 'react'
import Image from 'next/image'
import { Auth } from '@/components/auth/Auth'
import { Skeleton } from '@/components/ui/Skeleton'

export const metadata = {
  title: 'Login | Member Remora',
  description: 'Mulai perjalanan trading Anda bersama Remora',
}

export const dynamic = 'force-dynamic'

export default function LoginPage() {
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

      <Suspense fallback={<Skeleton />}>
        <Auth />
      </Suspense>
    </div>
  )
}
