import AdminPage from '@/components/admin/AdminPage'
import { fetchWithAuth } from '@/lib/api'
import { requireAdmin } from '@/lib/auth'
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
    const response = await fetchWithAuth<IAPIResponse<ICourse[]>>('/api/v2/admin/course')
    return response.data
  } catch {
    redirect('/login')
  }
}

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin()
  const courses = await getCourses()
  return <AdminPage initialCourses={courses} initialEmail={user.email} />
}
