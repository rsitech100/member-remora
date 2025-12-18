import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { ExpiredContent } from '../contents/ExpiredContent'
import { RemoraLogo } from '@/components/ui/Icon'

interface ExpiredModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ExpiredModal({ isOpen, onClose }: ExpiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-0">
        <div className="relative w-full h-48 md:h-full md:min-h-[500px] md:order-2 rounded-t-2xl md:rounded-t-none md:rounded-r-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Image
            src="/images/error.png"
            alt="Error"
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="p-8 md:p-12 flex items-center md:order-1 animate-slide-right relative">
          <RemoraLogo className="absolute top-8 left-8 md:top-12 md:left-12 animate-fade-in" width={50} height={50} />
          
          <div className="flex flex-col gap-8 w-full pt-16 md:pt-20">
            <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2A9E8B]">
                Oh no!
              </h1>
              <p className="text-gray-300 text-lg">
                Membership Remora anda sudah berakhir
              </p>
            </div>

            <ExpiredContent />
          </div>
        </div>
      </div>
    </Modal>
  )
}
