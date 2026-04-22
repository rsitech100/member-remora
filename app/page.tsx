import { redirect } from 'next/navigation'
import { checkAuth } from '@/lib/auth'

export default async function Home() {
  const { authenticated, role } = await checkAuth()

  if (!authenticated) {
    redirect('/login')
  }

  if (role === 'admin' || role === 'superadmin') {
    redirect('/admin')
  }

  redirect('/dashboard')
}

