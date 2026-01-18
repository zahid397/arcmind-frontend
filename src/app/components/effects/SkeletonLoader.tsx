'use client'

import { cn } from '@/app/lib/utils'

interface SkeletonLoaderProps {
  count?: number
  className?: string
  type?: 'text' | 'card' | 'chat' | 'avatar' | 'message'
  variant?: 'default' | 'compact' | 'detailed'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  speed?: 'slow' | 'medium' | 'fast'
}

const speedClasses = {
  slow: 'animate-pulse-slow',
  medium: 'animate-pulse',
  fast: 'animate-pulse-fast',
} as const

export default function SkeletonLoader({
  count = 1,
  className,
  type = 'text',
  variant = 'default',
  rounded = 'md',
  speed = 'medium',
}: SkeletonLoaderProps) {
  const base = cn(
    'bg-gradient-to-r from-compost-800/30 via-compost-700/20 to-compost-800/30',
    speedClasses[speed],
    {
      'rounded-none': rounded === 'none',
      'rounded-sm': rounded === 'sm',
      'rounded': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-full': rounded === 'full',
    }
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={cn("border border-compost-800/30 bg-compost-900/20 p-4", {
            'rounded-lg': rounded === 'md',
            'p-3': variant === 'compact',
            'p-6': variant === 'detailed',
          })}>
            <div className="flex items-center gap-3">
              <div className={cn(base, 'h-10 w-10')} />
              <div className="flex-1 space-y-2">
                <div className={cn(base, 'h-4', variant === 'compact' ? 'w-1/3' : 'w-1/4')} />
                <div className={cn(base, 'h-3', variant === 'compact' ? 'w-1/2' : 'w-1/2')} />
              </div>
            </div>
            {variant === 'detailed' && (
              <div className="mt-4 space-y-3">
                <div className={cn(base, 'h-3 w-full')} />
                <div className={cn(base, 'h-3 w-5/6')} />
              </div>
            )}
          </div>
        )

      case 'chat':
        return (
          <div className="flex items-start gap-3">
            <div className={cn(base, 'h-8 w-8')} />
            <div className="flex-1 space-y-2">
              <div className={cn(base, 'h-4', variant === 'compact' ? 'w-3/4' : 'w-3/4')} />
              <div className={cn(base, 'h-4', variant === 'compact' ? 'w-1/2' : 'w-1/2')} />
              {variant !== 'compact' && (
                <div className={cn(base, 'h-4 w-2/3')} />
              )}
            </div>
          </div>
        )

      case 'avatar':
        return (
          <div className="flex items-center gap-3">
            <div className={cn(base, 'h-12 w-12')} />
            <div className="flex-1 space-y-2">
              <div className={cn(base, 'h-4 w-1/3')} />
              <div className={cn(base, 'h-3 w-1/2')} />
            </div>
          </div>
        )

      case 'message':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={cn(base, 'h-6 w-6')} />
              <div className={cn(base, 'h-4 w-1/4')} />
            </div>
            <div className="space-y-2 ml-8">
              <div className={cn(base, 'h-4 w-full')} />
              <div className={cn(base, 'h-4 w-5/6')} />
              <div className={cn(base, 'h-4 w-4/6')} />
            </div>
          </div>
        )

      default: // 'text'
        return (
          <div className="space-y-2">
            <div className={cn(base, 'h-4', variant === 'compact' ? 'w-full' : 'w-full')} />
            <div className={cn(base, 'h-4', variant === 'compact' ? 'w-5/6' : 'w-5/6')} />
            <div className={cn(base, 'h-4', variant === 'compact' ? 'w-4/6' : 'w-4/6')} />
            {variant === 'detailed' && (
              <>
                <div className={cn(base, 'h-4 w-3/4')} />
                <div className={cn(base, 'h-4 w-2/3')} />
              </>
            )}
          </div>
        )
    }
  }

  return (
    <div 
      className={cn('space-y-4', className)}
      aria-label="Loading content"
      aria-busy="true"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={cn(count > 1 && i === 0 ? '' : '')}
          style={{
            animationDelay: `${i * 0.1}s`,
            opacity: 1 - (i * 0.1),
          }}
        >
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}
