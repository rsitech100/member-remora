import { getAuthToken } from '@/lib/auth'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

async function getDashboardData() {
  try {
    const token = await getAuthToken()
    if (!token) {
      redirect('/login')
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      headers: {
        'Cookie': `auth_token=${token}`,
      },
      cache: 'no-store',
    })
    
    if (res.ok) {
      const response: IAPIResponse<IDashboardData> = await res.json()
      return response.data
    }
  } catch (error) {
    console.error('Error fetching dashboard data for header:', error)
  }
  return null
}

interface UserLayoutViewProps {
  children: React.ReactNode
}

export async function UserLayoutView({ children }: UserLayoutViewProps) {
  const dashboardData = await getDashboardData()
  
  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <DashboardHeader dashboardData={dashboardData} />
      {children}
    </div>
  )
}
