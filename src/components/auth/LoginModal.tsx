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
      <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
        <div className="relative w-full h-48 md:h-full md:min-h-[500px] md:order-2 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/images/login.png"
            alt="Login"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A9E8B]/30 via-transparent to-transparent" />
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
