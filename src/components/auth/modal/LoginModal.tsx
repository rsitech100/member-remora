import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from '../forms/LoginForm'
import { RemoraLogo } from '@/components/ui/Icon'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (phoneNumber: string) => void
  onExpired: () => void
}

export function LoginModal({ isOpen, onClose, onSuccess, onExpired }: LoginModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col bg-[#0a0e14]">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src="/images/login.png"
            alt="Trading Chart"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d4b42]/60 to-transparent" />
          <div className="absolute top-3 left-3 rounded-md p-3 bg-[#0a0e14] z-10 ">
            <RemoraLogo className="z-12" width={30} height={30} />
          </div>
        </div>

        <div className="flex-1 px-6 pb-8 relative mt-12 z-10 mb-12">
          <h1 className="text-4xl font-semibold text-[#2A9E8B] text-center mb-8">
            Mulai Perjalanan<br />Tradingmu
          </h1>

          <LoginForm onSuccess={onSuccess} onExpired={onExpired} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex md:grid md:grid-cols-2 gap-0">
        <div className="relative w-full h-48 md:h-full md:min-h-[500px] md:order-2 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/images/login.png"
            alt="Login"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d4b42]/60 to-transparent" />
        </div>
        <div className="p-8 md:p-12 md:order-1 animate-slide-right relative">
          <RemoraLogo className="absolute top-8 left-8 md:top-12 md:left-12 animate-fade-in" width={50} height={50} />
          
          <div className="flex flex-col gap-8 pt-16 md:pt-20">
            <h1 className="text-3xl md:text-5xl text-[#2A9E8B] animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Mulai Perjalanan<br />Tradingmu
            </h1>

            <LoginForm onSuccess={onSuccess} onExpired={onExpired} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
