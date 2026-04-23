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
  } catch (error) {
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
  } catch (error) {
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
  const allCoursesMap = new Map(allCourses.map((course) => [course.id, course]))

  const lastWatchedCourse = dashboardCourses.find(dc => dc.last_watched_video)

  const coursesToDisplay = dashboardCourses
    .map((dashboardCourse) => {
      const course = allCoursesMap.get(dashboardCourse.course_id)
      if (!course) return null

    const isLastWatched = lastWatchedCourse?.course_id === course.id
    
    let status: 'completed' | 'now_watching' | 'in_progress' | 'not_started' = 'not_started'
    
    if (dashboardCourse.status === 'completed') {
      status = 'completed'
    } else if (isLastWatched && dashboardCourse.completed_videos > 0) {
      status = 'now_watching'
    } else if (dashboardCourse.completed_videos > 0) {
      status = 'in_progress'
    } else {
      status = 'not_started'
    }
    
    return {
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: course.image || '/images/dummy-image.png',
      duration: dashboardCourse?.progress || `${course.videos?.length || 0} Videos`,
      instructor: course.subtitle,
      status,
    }
  })
  .filter((course): course is NonNullable<typeof course> => course !== null)

  return (
    <div className="space-y-4">
      {coursesToDisplay.map((course) => (
        <CourseCard key={course.id} {...course} />
      ))}
    </div>
  )
}
