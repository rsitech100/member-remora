import { RemoraLogo } from '@/components/ui/Icon'
import { UserProfileButton } from '@/components/ui/UserProfileButton'
import { MobileMenuButton } from '@/components/auth/button/MobileMenuButton'
import { IDashboardData } from '@/types/api'

interface HeaderProps {
  dashboardData: IDashboardData | null
  isAdmin?: boolean
}

export function Header({ dashboardData, isAdmin = false }: HeaderProps) {
  const user = dashboardData?.user
  const userName = user ? `${user.first_name} ${user.last_name}` : 'Guest'
  const userInitial = user ? user.first_name.charAt(0).toUpperCase() : 'G'
  
  const formatExpirationDate = (dateStr: string | undefined) => {
    if (!dateStr) return '00 MM YYYY'
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }
  
  const expirationDate = formatExpirationDate(user?.expires_at)
  const displayTitle = isAdmin ? 'REMORA ADMIN' : 'REMORA'
  
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
          <MobileMenuButton userName={userName} userInitial={userInitial} expirationDate={expirationDate} />
        </div>

        <div className="flex items-center gap-2 md:hidden absolute left-1/2 transform -translate-x-1/2">
          <RemoraLogo width={35} height={35} className="brightness-0 invert" />
          <div className="text-white text-base">{displayTitle}</div>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4">
          <RemoraLogo width={35} height={35} className="brightness-0 invert" />
          <div>
            <div className="text-white text-lg">{displayTitle}</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {!isAdmin && (
            <span className="text-white/90 text-sm">
              Membership expiring on <span className="font-semibold">{expirationDate}</span>
            </span>
          )}
          
          <UserProfileButton userName={userName} userInitial={userInitial} />
        </div>
      </div>
    </header>
  )
}
