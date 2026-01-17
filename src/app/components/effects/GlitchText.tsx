'use client'

import { ReactNode } from 'react'
import { cn } from '@/app/lib/utils'

interface GlitchTextProps {
  children: ReactNode
  className?: string
}

export default function GlitchText({
  children,
  className,
}: GlitchTextProps) {
  return (
    <span
      className={cn(
        'relative inline-block glitch',
        className
      )}
      data-text={typeof children === 'string' ? children : undefined}
    >
      {children}
    </span>
  )
}
