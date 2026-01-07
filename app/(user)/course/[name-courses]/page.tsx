import { requireAuth } from '@/lib/auth'
import { CoursePage as CoursePageComponent } from '@/components/user/course/CoursePage'
import { redirect } from 'next/navigation'
import { getCourseIdFromSlug } from '@/lib/courseMapping'

export const metadata = {
  title: 'Course | Remora',
  description: 'Watch course video',
}

export default async function CoursePage({ params }: { params: Promise<{ 'name-courses': string }> }) {
  await requireAuth()
  const { 'name-courses': nameCourses } = await params
  
  const courseId = await getCourseIdFromSlug(nameCourses)
  
  if (!courseId) {
    redirect('/dashboard')
  }
  
  return <CoursePageComponent id={courseId.toString()} />
}
