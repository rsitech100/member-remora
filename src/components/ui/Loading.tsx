import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  fullScreen?: boolean
}

export function Loading({ size = 'md', className, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-[#2A9E8B] border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f1419] bg-opacity-80 z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-700 rounded', className)} />
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-[#1a2332] rounded-xl p-4 animate-pulse">
      <div className="flex gap-4">
        <LoadingSkeleton className="w-32 h-32 rounded-lg" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-6 w-3/4" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
          <div className="flex gap-2 mt-4">
            <LoadingSkeleton className="h-8 w-20" />
            <LoadingSkeleton className="h-8 w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="bg-[#1a2332] rounded-xl overflow-hidden animate-pulse">
      <LoadingSkeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-5 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
