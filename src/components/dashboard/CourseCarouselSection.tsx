import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { CourseCarousel } from './CourseCarousel'

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

export async function CourseCarouselSection() {
  const course = await getCourses()

  return <CourseCarousel course={course} />
}
