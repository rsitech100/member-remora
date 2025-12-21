import { CoursePageView } from '@/components/course/CoursePageView'

export const metadata = {
  title: 'Course | Remora',
  description: 'Watch course video',
}

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CoursePageView id={id} />
}
