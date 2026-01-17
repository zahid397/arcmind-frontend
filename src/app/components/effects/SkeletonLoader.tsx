'use client'

import { cn } from '@/app/lib/utils'

interface SkeletonLoaderProps {
  count?: number
  className?: string
  type?: 'text' | 'card' | 'chat'
}

export default function SkeletonLoader({
  count = 1,
  className,
  type = 'text',
}: SkeletonLoaderProps) {
  const base = 'animate-pulse bg-compost-800/50 rounded'

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="rounded-lg border border-compost-800/50 bg-compost-900/30 p-4">
            <div className="flex items-center gap-3">
              <div className={cn(base, 'h-10 w-10 rounded-full')} />
              <div className="flex-1 space-y-2">
                <div className={cn(base, 'h-4 w-1/4')} />
                <div className={cn(base, 'h-3 w-1/2')} />
              </div>
            </div>
          </div>
        )

      case 'chat':
        return (
          <div className="flex items-start gap-3">
            <div className={cn(base, 'h-8 w-8 rounded-full')} />
            <div className="flex-1 space-y-2">
              <div className={cn(base, 'h-4 w-3/4')} />
              <div className={cn(base, 'h-4 w-1/2')} />
              <div className={cn(base, 'h-4 w-2/3')} />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <div className={cn(base, 'h-4 w-full')} />
            <div className={cn(base, 'h-4 w-5/6')} />
            <div className={cn(base, 'h-4 w-4/6')} />
          </div>
        )
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  )
}
