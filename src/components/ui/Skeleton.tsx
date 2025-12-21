import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-700/50 rounded',
        className
      )}
    />
  )
}

export function VideoPlayerSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-40" />
      
      <div className="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-gray-700/50 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 border-t border-gray-700 pt-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-full max-w-2xl" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="flex gap-2 border-t border-gray-700 pt-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}

export function CourseProgressSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-36" />
      
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-gray-800/50 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 space-y-3">
      <div className="flex gap-4">
        <Skeleton className="w-32 h-20 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export function ProgressCardSkeleton() {
  return (
    <div className="bg-[#1a2332] rounded-xl p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="flex items-center justify-center py-8">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function LastVideoCardSkeleton() {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 space-y-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="w-full aspect-video rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}
