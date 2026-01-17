'use client'

import { cn } from '@/app/lib/utils'

interface NeonGridProps {
  size?: number
  color?: string
  opacity?: number
  className?: string
  animated?: boolean
}

export default function NeonGrid({
  size = 48,
  color = '#00ff00',
  opacity = 0.03,
  className,
  animated = false, // 🔥 DEFAULT OFF
}: NeonGridProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-20 pointer-events-none",
        animated && "animate-neon-grid",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    />
  )
}
