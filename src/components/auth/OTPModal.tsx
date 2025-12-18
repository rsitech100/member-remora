import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { OTPForm } from '../forms/OTPForm'
import { RemoraLogo } from '@/components/ui/Icon'

interface OTPModalProps {
  isOpen: boolean
  onClose: () => void
  phoneNumber: string
  onSuccess: () => void
}

const maskPhoneNumber = (phone: string) => {
  if (phone.length < 4) return phone
  return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4)
}

export function OTPModal({ isOpen, onClose, phoneNumber, onSuccess }: OTPModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
        <div className="relative w-full h-48 md:h-full md:min-h-[500px] md:order-2 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/images/otp.png"
            alt="OTP"
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
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A9E8B] mb-3">
                OTP Verification
              </h1>
              <p className="text-gray-400 text-sm">
                Silakan masukkan OTP yang dikirimkan di nomor ponsel<br />
                Anda {maskPhoneNumber(phoneNumber)}
              </p>
            </div>

            <OTPForm phoneNumber={phoneNumber} onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
