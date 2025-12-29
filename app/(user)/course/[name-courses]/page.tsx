import { requireAuth } from '@/lib/auth'
import { CoursePage as CoursePageComponent } from '@/components/user/course/CoursePage'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourse } from '@/types/api'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Course | Remora',
  description: 'Watch course video',
}

async function getCourseIdFromTitle(title: string): Promise<number | null> {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/courses')
    const matchingCourse = response.data.find(
      course => course.title.trim() === title.trim()
    )
    return matchingCourse?.id || null
  } catch {
    return null
  }
}

export default async function CoursePage({ params }: { params: Promise<{ 'name-courses': string }> }) {
  await requireAuth()
  const { 'name-courses': nameCourses } = await params
  const decodedTitle = decodeURIComponent(nameCourses)
  
  const courseId = await getCourseIdFromTitle(decodedTitle)
  
  if (!courseId) {
    redirect('/dashboard')
  }
  
  return <CoursePageComponent id={courseId.toString()} />
}
