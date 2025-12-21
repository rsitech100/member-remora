import { Container } from '@/components/layout/Container'
import { VideoPlayerSkeleton, CourseProgressSkeleton } from '@/components/ui/Skeleton'

export default function CourseLoading() {
  return (
    <Container className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <VideoPlayerSkeleton />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CourseProgressSkeleton />
          </div>
        </div>
      </div>
    </Container>
  )
}

