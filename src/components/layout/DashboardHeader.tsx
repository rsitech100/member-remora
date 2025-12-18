import { RemoraLogo } from '@/components/ui/Icon'
import { UserProfileButton } from '@/components/button/UserProfileButton'
import { MobileMenuButton } from '@/components/button/MobileMenuButton'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 relative bg-gradient-to-r from-[#0f4238] via-[#165046] to-[#1a5d52]">
      <svg 
        className="absolute -bottom-11 left-0 scale-y-[-1]" 
        width="47" 
        height="47" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 0 23 L 0 0 Q 0 22 30 23 Z" 
          fill="#0f4238"
        />
      </svg>

      <svg 
        className="md:hidden absolute -bottom-11 -right-0 scale-x-[-1] scale-y-[-1]" 
        width="47" 
        height="47" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M 0 23 L 0 0 Q 0 22 30 23 Z" 
          fill="#1a5d52"
        />
      </svg>
      
      <div className="relative w-full px-4 md:px-6 h-20 flex items-center justify-between md:justify-between z-10">
        <div className="flex items-center md:hidden">
          <MobileMenuButton />
        </div>

        <div className="flex items-center gap-2 md:hidden absolute left-1/2 transform -translate-x-1/2">
          <RemoraLogo width={35} height={35} className="brightness-0 invert" />
          <div className="text-white text-base">REMORA</div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4">
          <RemoraLogo width={35} height={35} className="brightness-0 invert" />
          <div>
            <div className="text-white text-lg">REMORA</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <span className="text-white/90 text-sm">
            Membership expiring on <span className="font-semibold">00 MM YYYY</span>
          </span>
          
          <UserProfileButton userName="Jay Park" userInitial="J" />
        </div>
      </div>
    </header>
  )
}
