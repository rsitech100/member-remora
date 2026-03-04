import { redirect } from 'next/navigation'
import { checkAuth, getAuthToken, getAdminRedirectUrl } from '@/lib/auth'

export default async function Home() {
  const { authenticated, role } = await checkAuth()

  if (!authenticated) {
    redirect('/login')
  }

  if (role === 'admin' || role === 'superadmin') {
    const token = await getAuthToken()
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL
    if (token && adminUrl) {
      redirect(getAdminRedirectUrl(token))
    }
    redirect('/admin')
  }

  redirect('/dashboard')
}

