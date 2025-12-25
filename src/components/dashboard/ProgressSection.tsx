import { redirect } from 'next/navigation'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { ProgressCard } from '../cards/ProgressCard'

async function getDashboardData() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
  
  // Redirect admin users to admin panel
  if (response.data.user.role === 'admin' || response.data.user.role === 'superadmin') {
    redirect('/admin')
  }
  
  return response.data
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
