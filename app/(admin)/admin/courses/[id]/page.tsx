import { redirect } from 'next/navigation'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, IDashboardData, ICourseDetailData } from '@/types/api'
import CourseVideoManagement from '@/components/admin/CourseVideoManagement'

async function checkAdminAccess() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }

  try {
    const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    if (response.data.user.role !== 'admin' && response.data.user.role !== 'superadmin') {
      redirect('/dashboard')
    }
  } catch (error) {
    redirect('/login')
  }
}

async function getCourseData(id: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourseDetailData>>(`/api/courses/${id}`)
    // Ensure videos is always an array
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
  await checkAdminAccess()
  const { id } = await params
  const courseData = await getCourseData(id)

  if (!courseData) {
    redirect('/admin')
  }

  return <CourseVideoManagement courseData={courseData} />
}
