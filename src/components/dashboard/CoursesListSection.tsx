import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse, IDashboardData } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { CourseCard } from '../cards/CourseCard'

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

async function getCourses() {
  try {
    const token = await getAuthToken()
    if (!token) {
      redirect('/login')
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    const res = await fetch(`${baseUrl}/api/courses`, {
      headers: {
        'Cookie': `auth_token=${token}`,
      },
      cache: 'no-store',
    })
    
    if (!res.ok) {
      throw new Error(`Courses API returned ${res.status}`)
    }
    
    const response: IAPIResponse<ICourse[]> = await res.json()
    return response.data
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export async function CoursesListSection() {
  const [dashboardData, allCourses] = await Promise.all([
    getDashboardData(),
    getCourses(),
  ])

  const dashboardCourses = dashboardData?.courses || []

  const coursesToDisplay = allCourses.map(course => {
    const dashboardCourse = dashboardCourses.find(dc => dc.course_id === course.id)
    return {
      id: course.id.toString(),
      title: course.title,
      description: course.description,
      thumbnail: course.image || '/images/course-1.jpg',
      duration: `${course.videos.length} Videos`,
      instructor: course.subtitle,
      completed: dashboardCourse?.completed_videos === dashboardCourse?.total_videos,
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
