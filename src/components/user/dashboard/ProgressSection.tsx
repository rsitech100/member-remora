import { redirect } from 'next/navigation'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { ProgressCard } from '@/components/user/cards/ProgressCard'
import { calculateTotalProgress } from './utils'

async function getDashboardData() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  try {
    const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    return response.data
  } catch (error) {
    redirect('/login')
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

  const progress = calculateTotalProgress(dashboardData.courses)

  return (
    <ProgressCard
      percentage={progress.percentage}
      completed={progress.completed}
      total={progress.total}
      isMobile={isMobile}
    />
  )
}
