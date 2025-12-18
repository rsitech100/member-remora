import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'default' | 'full'
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-8 lg:px-14 mt-6',
        size === 'default' && 'container',
        size === 'full' && 'w-full',
        className
      )}
    >
      {children}
    </div>
  )
}
