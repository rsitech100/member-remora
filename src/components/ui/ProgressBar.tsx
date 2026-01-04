import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number 
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export function ProgressBar({
  progress,
  showPercentage = true,
  size = 'md',
  className,
  label,
  variant = 'default'
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const variantClasses = {
    default: 'bg-[#2A9E8B]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  }

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-700 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant]
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {!label && showPercentage && (
        <div className="text-xs text-gray-400 mt-1">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  )
}
