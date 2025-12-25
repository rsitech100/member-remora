import LoginView from '@/components/login/LoginView'
import { redirect } from 'next/navigation'
import { isAuthenticated, getAuthToken, removeAuthToken } from '@/lib/auth'
import { fetchWithAuth } from '@/lib/api'
import { IAPIResponse, IDashboardData } from '@/types/api'

export const metadata = {
  title: 'Login | Member Remora',
  description: 'Mulai perjalanan trading Anda bersama Remora',
}

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    try {
      const data = await fetchWithAuth<IAPIResponse<IDashboardData>>('/api/dashboard')
      const role = data.data?.user?.role
      
      if (role === 'admin' || role === 'superadmin') {
        redirect('/admin')
      } else {
        redirect('/dashboard')
      }
    } catch (error) {
      redirect('/api/logout')
    }
  }

  return <LoginView />
}
