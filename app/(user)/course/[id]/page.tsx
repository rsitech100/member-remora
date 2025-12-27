import { requireAuth } from '@/lib/auth'
import { CoursePage as CoursePageComponent } from '@/components/user/course/CoursePage'

export const metadata = {
  title: 'Course | Remora',
  description: 'Watch course video',
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth()
  const { id } = await params
  
  return <CoursePageComponent id={id} />
}
