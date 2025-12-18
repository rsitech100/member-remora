import { RemoraLogo } from '@/components/ui/Icon'
import { UserProfileButton } from '@/components/button/UserProfileButton'
import { MobileMenuButton } from '@/components/button/MobileMenuButton'

export function DashboardHeader() {
  return (
    <header className="bg-[#0d6157]">
      <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between md:justify-between">
        <div className="flex items-center md:hidden">
          <MobileMenuButton />
        </div>

        <div className="flex items-center gap-2 md:hidden absolute left-1/2 transform -translate-x-1/2">
          <RemoraLogo width={32} height={32} />
          <div className="text-white font-bold text-base">REMORA</div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <RemoraLogo width={40} height={40} />
          <div>
            <div className="text-white font-bold text-lg">REMORA</div>
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
