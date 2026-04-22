import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourseDetailData } from '@/types/api'
import AdminCourseVideoPage from '@/components/admin/AdminCourseVideoPage'
import { getCourseIdFromSlug } from '@/lib/courseMapping'

type AdminCourseApiData =
  | ICourseDetailData
  | {
      id: number
      title: string
      subtitle?: string
      description?: string
      image?: string
      thumbnail_url?: string
      videos?: ICourseDetailData['videos']
    }

function isNestedCourseData(data: AdminCourseApiData): data is ICourseDetailData {
  return typeof data === 'object' && data !== null && 'course' in data
}

function normalizeCourseData(data: AdminCourseApiData): ICourseDetailData {
  if (isNestedCourseData(data)) {
    return {
      ...data,
      videos: data.videos || [],
    }
  }

  return {
    course: {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle || '',
      description: data.description || '',
      image: data.image || data.thumbnail_url || '',
    },
    videos: data.videos || [],
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCourseData(id: string) {
  try {
    const response = await fetchWithAuth<IAPIResponse<AdminCourseApiData>>(`/api/v2/admin/course/${id}`)
    return normalizeCourseData(response.data)
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

  const idMatch = nameCourses.match(/^(\d+)-/)
  const idFromSlug = idMatch ? Number(idMatch[1]) : NaN
  const courseId = Number.isFinite(idFromSlug) && idFromSlug > 0
    ? idFromSlug
    : await getCourseIdFromSlug(nameCourses)
  
  if (!courseId) {
    redirect('/admin')
  }

  const courseData = await getCourseData(courseId.toString())

  if (!courseData) {
    redirect('/admin')
  }

  return <AdminCourseVideoPage courseData={courseData} />
}
