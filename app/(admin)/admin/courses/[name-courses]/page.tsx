import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData, ICourse } from '@/types/api'
import AdminCourseVideoPage from '@/components/admin/AdminCourseVideoPage'

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

async function getCourseData(id: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourseDetailData>>(`/api/courses/${id}`)
    return {
      ...response.data,
      videos: response.data.videos || []
    }
  } catch (error) {
    return null
  }
}

export default async function CourseManagementPage({
  params,
}: {
  params: Promise<{ 'name-courses': string }>
}) {
  await requireAdmin()
  const { 'name-courses': nameCourses } = await params
  const decodedTitle = decodeURIComponent(nameCourses)
  
  const courseId = await getCourseIdFromTitle(decodedTitle)
  
  if (!courseId) {
    redirect('/admin')
  }

  const courseData = await getCourseData(courseId.toString())

  if (!courseData) {
    redirect('/admin')
  }

  return <AdminCourseVideoPage courseData={courseData} />
}
