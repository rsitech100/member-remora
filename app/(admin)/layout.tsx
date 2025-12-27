import { requireAdmin } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { SessionChecker } from '@/components/auth/SessionChecker'
import { Container } from '@/components/layout/Container'

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, dashboardData } = await requireAdmin()

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <SessionChecker />
      <Header dashboardData={dashboardData || null} isAdmin={true} />
      {children}
    </div>
  )
}
