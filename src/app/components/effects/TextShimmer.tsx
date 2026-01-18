'use client'

import { ReactNode } from 'react'
import { cn } from '@/app/lib/utils'

interface TextShimmerProps {
children: ReactNode
className?: string
speed?: 'slow' | 'medium' | 'fast'
size?: 'sm' | 'md' | 'lg'
variant?: 'cyan' | 'green' | 'blue' | 'rainbow'
}

const gradientVariants = {
cyan: 'from-neon-cyan to-neon-cyan/70',
green: 'from-neon-green to-neon-green/70',
blue: 'from-neon-blue to-neon-blue/70',
rainbow: 'from-neon-cyan via-neon-green to-neon-blue',
} as const

const speedClasses = {
slow: 'animate-text-shimmer-slow',
medium: 'animate-text-shimmer',
fast: 'animate-text-shimmer-fast',
} as const

const sizeClasses = {
sm: 'text-sm',
md: 'text-base',
lg: 'text-lg md:text-xl',
} as const

export default function TextShimmer({
children,
className,
speed = 'medium',
size = 'md',
variant = 'rainbow',
}: TextShimmerProps) {
return (
<span
className={cn(
'relative inline-block font-medium',
'bg-gradient-to-r',
gradientVariants[variant],
'bg-[length:200%_auto]',
'bg-clip-text text-transparent',
speedClasses[speed],
sizeClasses[size],
className
)}
aria-label={typeof children === 'string' ? children : undefined}
>
{children}
</span>
)
}
