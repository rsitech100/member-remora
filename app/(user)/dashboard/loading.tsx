import { Container } from '@/components/layout/Container'
import { CourseCardSkeleton, ProgressCardSkeleton, LastVideoCardSkeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <>
      {/* Mobile View */}
      <Container className="lg:hidden py-6 space-y-6">
        <LastVideoCardSkeleton />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
              <div className="w-10 h-10 bg-gray-700 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[200px] bg-gray-800 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        </div>

        <ProgressCardSkeleton />
      </Container>

      {/* Desktop View */}
      <Container className="hidden lg:block py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-40 bg-gray-700 rounded animate-pulse" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ProgressCardSkeleton />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

