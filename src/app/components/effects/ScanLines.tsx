'use client'

import { cn } from '@/app/lib/utils'

interface ScanLinesProps {
  className?: string
  opacity?: number
}

export default function ScanLines({
  className,
  opacity = 0.06,
}: ScanLinesProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none -z-10",
        "scanlines",
        className
      )}
      style={{ opacity }}
    />
  )
}
