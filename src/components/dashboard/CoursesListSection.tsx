import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { CourseCard } from '../cards/CourseCard'

async function getDashboardData() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
  return response.data
}

async function getCourses() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/courses')
  return response.data
}

export async function CoursesListSection() {
  const [dashboardData, allCourses] = await Promise.all([
    getDashboardData(),
    getCourses(),
  ])

  if (!dashboardData) return null

  const dashboardCourses = dashboardData.courses || []

  const coursesToDisplay = allCourses.map(course => {
    const dashboardCourse = dashboardCourses.find(dc => dc.course_id === course.id)
    return {
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: course.image || '/images/dummy-image.png',
      duration: dashboardCourse?.progress || `${course.videos.length} Videos`,
      instructor: course.subtitle,
      completed: dashboardCourse?.status === 'completed',
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
