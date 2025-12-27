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

export function OTPModal({ isOpen, onClose, phoneNumber, onSuccess }: OTPModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Mobile View */}
      <div className="md:hidden flex flex-col bg-[#0a0e14]">
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src="/images/otp.png"
            alt="OTP Security"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className='absolute top-3 left-3 bg-[#0a0e14] rounded-md p-3 '>
            <RemoraLogo className=" z-10" width={30} height={30} />
          </div>
        </div>

        <div className="flex-1 px-6 pb-8 mt-8 relative z-10">
          <h1 className="text-4xl text-center font-semibold text-[#2A9E8B] mb-3">
            OTP Verification
          </h1>
          <p className="text-center text-sm mb-6">
            Silakan masukkan OTP yang dibagikan di nomor ponsel
            Anda {phoneNumber}
          </p>

          <OTPForm phoneNumber={phoneNumber} onSuccess={onSuccess} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex md:grid md:grid-cols-2 gap-0">
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
          
          <div className="flex flex-col gap-4 pt-16 md:pt-20">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-3xl md:text-4xl font-bold text-[#2A9E8B] mb-3">
                OTP Verification
              </h1>
              <p className="text-sm">
                Silakan masukkan OTP yang dibagikan di nomor ponsel<br />
                Anda {phoneNumber}
              </p>
            </div>

            <OTPForm phoneNumber={phoneNumber} onSuccess={onSuccess} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
