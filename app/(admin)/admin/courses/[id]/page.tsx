import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData } from '@/types/api'
import AdminCourseVideoPage from '@/components/admin/AdminCourseVideoPage'

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
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const courseData = await getCourseData(id)

  if (!courseData) {
    redirect('/admin')
  }

  return <AdminCourseVideoPage courseData={courseData} />
}
