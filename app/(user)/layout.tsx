import { requireAuth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { SessionChecker } from '@/components/auth/SessionChecker'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { dashboardData } = await requireAuth()
  
  if (!dashboardData) {
    throw new Error('Dashboard data not available')
  }
  
  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <SessionChecker />
      <Header dashboardData={dashboardData} />
      {children}
    </div>
  )
}
