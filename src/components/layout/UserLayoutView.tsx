import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { SessionChecker } from '@/components/auth/SessionChecker'

async function getDashboardData() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
  return response.data
}

interface UserLayoutViewProps {
  children: React.ReactNode
}

export async function UserLayoutView({ children }: UserLayoutViewProps) {
  const dashboardData = await getDashboardData()
  
  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <SessionChecker />
      <DashboardHeader dashboardData={dashboardData} />
      {children}
    </div>
  )
}
