// src/app/components/effects/GlitchText.tsx
'use client'

import { ReactNode } from 'react'
import { cn } from '@/app/lib/utils'

interface GlitchTextProps {
children: ReactNode
className?: string
intensity?: 'low' | 'medium' | 'high'
enabled?: boolean
}

export default function GlitchText({
children,
className,
intensity = 'medium',
enabled = true,
}: GlitchTextProps) {
if (!enabled) {
return <span className={className}>{children}</span>
}

const childText = typeof children === 'string' ? children : ''

const intensityClass = {
low: 'opacity-60',
medium: 'opacity-80',
high: 'opacity-100',
}[intensity]

return (
<span
className={cn('glitch-effect', intensityClass, className)}
data-text={childText}
aria-label={childText}
>
{children}
</span>
)
}
