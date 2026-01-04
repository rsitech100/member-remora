import AdminPage from '@/components/admin/AdminPage'

export const metadata = {
  title: 'Admin Panel | Remora',
  description: 'Admin Dashboard',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminDashboardPage() {
  return <AdminPage />
}
