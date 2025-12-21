import { redirect } from 'next/navigation'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { ProgressCard } from '../cards/ProgressCard'

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
    
    if (!res.ok) {
      throw new Error(`Dashboard API returned ${res.status}`)
    }
    
    const response: IAPIResponse<IDashboardData> = await res.json()
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

interface ProgressSectionProps {
  isMobile?: boolean
}

export async function ProgressSection({ isMobile = false }: ProgressSectionProps) {
  const dashboardData = await getDashboardData()
  
  if (!dashboardData) {
    return (
      <ProgressCard
        percentage={0}
        completed={0}
        total={0}
        isMobile={isMobile}
      />
    )
  }

  const totalVideos = dashboardData.courses.reduce((sum, course) => sum + course.total_videos, 0)
  const totalCompleted = dashboardData.courses.reduce((sum, course) => sum + course.completed_videos, 0)
  const percentage = totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0

  return (
    <ProgressCard
      percentage={percentage}
      completed={totalCompleted}
      total={totalVideos}
      isMobile={isMobile}
    />
  )
}
