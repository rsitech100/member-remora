import { redirect } from 'next/navigation'
import { IAPIResponse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { LastVideoCard } from '@/components/user/cards/LastVideoCard'

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
      courseTitle={lastWatchedCourse.title}
    />
  )
}
