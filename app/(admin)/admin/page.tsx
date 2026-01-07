import AdminPage from '@/components/admin/AdminPage'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, ICourse } from '@/types/api'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Admin Panel | Remora',
  description: 'Admin Dashboard',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCourses() {
  try {
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/courses')
    return response.data
  } catch (error) {
    redirect('/login')
  }
}

export default async function AdminDashboardPage() {
  const courses = await getCourses()
  return <AdminPage initialCourses={courses} />
}
