'use client'

import { IUser } from '@/types/api'
import { LogoutButton } from '@/components/button/LogoutButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminLayoutViewProps {
  user: IUser
  children: React.ReactNode
}

export default function AdminLayoutView({ user, children }: AdminLayoutViewProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="text-[#2A9E8B] font-bold text-xl">Remora Admin</div>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/admin'
                      ? 'text-[#2A9E8B]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Courses
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {user.first_name} {user.last_name}
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
