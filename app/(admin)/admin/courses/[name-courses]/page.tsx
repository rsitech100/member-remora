import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData } from '@/types/api'
import AdminCourseVideoPage from '@/components/admin/AdminCourseVideoPage'
import { getCourseIdFromSlug } from '@/lib/courseMapping'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    
  const courseId = await getCourseIdFromSlug(nameCourses)
  
  if (!courseId) {
    redirect('/admin')
  }

  const courseData = await getCourseData(courseId.toString())

  if (!courseData) {
    redirect('/admin')
  }

  return <AdminCourseVideoPage courseData={courseData} />
}
