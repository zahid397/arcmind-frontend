'use client'

import { cn } from '@/app/lib/utils'

interface ScanLinesProps {
className?: string
opacity?: number
color?: string
intensity?: 'low' | 'medium' | 'high'
}

export default function ScanLines({
className,
opacity = 0.06,
color = '#00ff00',
intensity = 'medium',
}: ScanLinesProps) {
const lineSize = {
low: '1px',
medium: '2px',
high: '3px'
}[intensity]

const lineSpacing = {
low: '4px',
medium: '3px',
high: '2px'
}[intensity]

return (
<div
className={cn(
"fixed inset-0 pointer-events-none -z-10",
className
)}
style={{
backgroundImage: repeating-linear-gradient(   0deg,   transparent,   transparent ${lineSpacing},   ${color} ${lineSpacing},   ${color} calc(${lineSpacing} + ${lineSize})   ),
opacity,
backgroundSize: 100% calc(${lineSpacing} + ${lineSize}),
}}
aria-hidden="true"
/>
)
  }
