import LoginView from '@/components/login/LoginView'
import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export const metadata = {
  title: 'Login | Member Remora',
  description: 'Mulai perjalanan trading Anda bersama Remora',
}

export default async function LoginPage() {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    redirect('/dashboard')
  }

  return <LoginView />
}
