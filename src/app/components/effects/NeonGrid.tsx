'use client'

import { CSSProperties } from 'react'
import { cn } from '@/app/lib/utils'

interface NeonGridProps {
size?: number
color?: string
opacity?: number
className?: string
animated?: boolean
speed?: 'slow' | 'medium' | 'fast'
}

export default function NeonGrid({
size = 48,
color = '#00ff00',
opacity = 0.03,
className,
animated = false,
speed = 'medium',
}: NeonGridProps) {
const speedClass = {
slow: 'animate-neon-grid-slow',
medium: 'animate-neon-grid',
fast: 'animate-neon-grid-fast',
} as const

return (
<div
className={cn(
'fixed inset-0 -z-20 pointer-events-none neon-grid',
animated ? speedClass[speed] : '',
className
)}
style={{
backgroundImage:   linear-gradient(to right, ${color} 1px, transparent 1px),   linear-gradient(to bottom, ${color} 1px, transparent 1px)  ,
backgroundSize: ${size}px ${size}px,
opacity,
// ✅ Type-safe way to set CSS custom property
...({ '--neon-grid-size': ${size}px } as CSSProperties),
}}
aria-hidden="true"
/>
)
  }
