import { redirect } from 'next/navigation'
import { checkAuth, getAuthToken } from '@/lib/auth'

export default async function Home() {
  const { authenticated, role } = await checkAuth()

  if (!authenticated) {
    redirect('/login')
  }

  if (role === 'admin' || role === 'superadmin') {
    const token = await getAuthToken()
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL
    if (token && adminUrl) {
      redirect(`${adminUrl}/api/auth/set-token-redirect?token=${encodeURIComponent(token)}&redirect=/admin`)
    }
    redirect('/admin')
  }

  redirect('/dashboard')
}

