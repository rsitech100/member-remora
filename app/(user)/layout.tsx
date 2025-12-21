import { UserLayoutView } from '@/components/layout/UserLayoutView'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserLayoutView>{children}</UserLayoutView>
}
