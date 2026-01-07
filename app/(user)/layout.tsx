import { requireAuth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { SessionChecker } from '@/components/auth/SessionChecker'
import { CourseProvider } from '@/contexts/CourseContext'
import { getCourseMapping } from '@/lib/courseMapping'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { dashboardData } = await requireAuth()
  
  if (!dashboardData) {
    throw new Error('Dashboard data not available')
  }
  
  const courseMapping = await getCourseMapping()
  
  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <SessionChecker />
      <CourseProvider courseMapping={courseMapping}>
        <Header dashboardData={dashboardData} />
        {children}
      </CourseProvider>
    </div>
  )
}
