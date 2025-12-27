import { Suspense } from 'react'
import { Container } from '@/components/layout/Container'
import { PromoCard } from '@/components/user/cards/PromoCard'
import { LastWatchedSection } from './LastWatchedSection'
import { CourseCarouselSection } from './CourseCarouselSection'
import { ProgressSection } from './ProgressSection'
import { CoursesListSection } from './CoursesListSection'
import { 
  Skeleton,
  LastVideoCardSkeleton, 
  CourseCardSkeleton, 
  ProgressCardSkeleton 
} from '@/components/ui/Skeleton'

export async function DashboardPage() {
  return (
    <>
      {/* Mobile View */}
      <Container className="lg:hidden py-6 space-y-6">
        <Suspense fallback={<LastVideoCardSkeleton />}>
          <LastWatchedSection />
        </Suspense>

        <Suspense fallback={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="min-w-[200px] h-32 rounded-xl" />
              ))}
            </div>
          </div>
        }>
          <CourseCarouselSection />
        </Suspense>

        <Suspense fallback={<ProgressCardSkeleton />}>
          <ProgressSection isMobile={true} />
        </Suspense>
        
        <PromoCard />
      </Container>

      {/* Desktop View */}
      <Container className="hidden lg:block py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-[#2A9E8B] text-3xl font-semibold mb-4">Semua Modul</h2>
            </div>
            
            <Suspense fallback={
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            }>
              <CoursesListSection />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={<ProgressCardSkeleton />}>
                <ProgressSection />
              </Suspense>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
