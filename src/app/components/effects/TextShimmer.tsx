'use client'

import { ReactNode } from 'react'
import { cn } from '@/app/lib/utils'

interface TextShimmerProps {
  children: ReactNode
  className?: string
}

export default function TextShimmer({
  children,
  className,
}: TextShimmerProps) {
  return (
    <span
      className={cn(
        'relative inline-block',
        'bg-gradient-to-r from-neon-cyan via-neon-green to-neon-blue',
        'bg-[length:200%_100%]',
        'bg-clip-text text-transparent',
        'animate-text-shimmer',
        className
      )}
    >
      {children}
    </span>
  )
}
