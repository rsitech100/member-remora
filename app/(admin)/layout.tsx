import { redirect } from 'next/navigation'
import { getAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, IDashboardData } from '@/types/api'
import AdminLayoutView from '@/components/admin/AdminLayoutView'

async function checkAdminAccess() {
  const token = await getAuthToken()
  if (!token) {
    redirect('/login')
  }

  try {
    const response = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
    const user = response.data.user

    if (user.role !== 'admin' && user.role !== 'superadmin') {
      redirect('/dashboard')
    }

    return user
  } catch (error) {
    redirect('/login')
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAdminAccess()

  return <AdminLayoutView user={user}>{children}</AdminLayoutView>
}
