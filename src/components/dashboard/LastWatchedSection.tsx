import { redirect } from 'next/navigation'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { LastVideoCard } from '../cards/LastVideoCard'

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

export async function LastWatchedSection() {
  const dashboardData = await getDashboardData()
  
  if (!dashboardData) return null
  
  const lastWatchedCourse = dashboardData.courses.find(c => c.last_watched_video)
  const lastWatchedVideo = lastWatchedCourse?.last_watched_video
  
  if (!lastWatchedVideo || !lastWatchedCourse) return null
  
  return (
    <LastVideoCard
      title={lastWatchedCourse.title}
      description={lastWatchedCourse.description}
      instructor={dashboardData.user.first_name + ' ' + dashboardData.user.last_name}
      instructorRole="Student"
      thumbnail="/images/last-video.jpg"
      duration={lastWatchedCourse.progress}
      totalVideos={`${lastWatchedCourse.completed_videos}/${lastWatchedCourse.total_videos} Videos`}
      language="Indonesia"
      courseId={lastWatchedCourse.course_id}
    />
  )
}
