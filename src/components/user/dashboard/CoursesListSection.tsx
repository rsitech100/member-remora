import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { CourseCard } from '@/components/user/cards/CourseCard'

async function getDashboardData() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  try {
    const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    return response.data
  } catch {
    redirect('/login')
  }
}

async function getCourses() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/v2/user/course')
    return response.data
  } catch {
    redirect('/login')
  }
}

export async function CoursesListSection() {
  const [dashboardData, allCourses] = await Promise.all([
    getDashboardData(),
    getCourses(),
  ])

  if (!dashboardData) return null

  const dashboardCourses = dashboardData.courses || []
  const dashboardCourseIds = new Set(dashboardCourses.map((course) => course.course_id))
  const visibleCourses = allCourses.filter((course) => dashboardCourseIds.has(course.id))
  const dashboardCoursesMap = new Map(dashboardCourses.map((course) => [course.course_id, course]))

  const lastWatchedCourse = dashboardCourses.find(dc => dc.last_watched_video)

  const coursesToDisplay = visibleCourses.map((course) => {
    const dashboardCourse = dashboardCoursesMap.get(course.id)
    const isLastWatched = lastWatchedCourse?.course_id === course.id

    let status: 'completed' | 'now_watching' | 'in_progress' | 'not_started' = 'not_started'

    if (dashboardCourse?.status === 'completed') {
      status = 'completed'
    } else if (isLastWatched && (dashboardCourse?.completed_videos || 0) > 0) {
      status = 'now_watching'
    } else if ((dashboardCourse?.completed_videos || 0) > 0) {
      status = 'in_progress'
    }

    const fallbackVideoCount = course.video_count ?? course.videos?.length ?? 0
    const hasDashboardTotals = (dashboardCourse?.total_videos || 0) > 0
    const duration = hasDashboardTotals
      ? `${dashboardCourse?.completed_videos || 0}/${dashboardCourse?.total_videos || 0} Videos`
      : `${fallbackVideoCount} Videos`

    return {
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: course.image || '/images/dummy-image.png',
      duration,
      instructor: course.subtitle,
      status,
    }
  })

  return (
    <div className="space-y-4">
      {coursesToDisplay.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  )
}
