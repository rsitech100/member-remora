import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { CourseCarousel } from './CourseCarousel'

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

export async function CourseCarouselSection() {
  const [dashboardData, courses] = await Promise.all([getDashboardData(), getCourses()])
  const dashboardCourseIds = new Set((dashboardData?.courses || []).map((course) => course.course_id))
  const visibleCourses = courses.filter((course) => dashboardCourseIds.has(course.id))

  return <CourseCarousel course={visibleCourses} />
}
