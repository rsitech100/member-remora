import { redirect } from 'next/navigation'
import { IAPIResponse, ICourse } from '@/types/api'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { CourseCarousel } from './CourseCarousel'

async function getCourses() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }
  
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/courses')
    return response.data
  } catch (error) {
    redirect('/login')
  }
}

export async function CourseCarouselSection() {
  const course = await getCourses()

  return <CourseCarousel course={course} />
}
