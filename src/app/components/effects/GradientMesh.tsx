'use client'

import { cn } from '@/app/lib/utils'

interface GradientMeshProps {
  className?: string
  intensity?: 'low' | 'medium'
}

export default function GradientMesh({
  className,
  intensity = 'medium',
}: GradientMeshProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 -z-20 pointer-events-none",
        intensity === 'medium' ? "animate-gradient-mesh" : "",
        className
      )}
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(0,255,247,0.12), transparent 40%),
          radial-gradient(circle at 80% 30%, rgba(0,255,0,0.1), transparent 40%),
          radial-gradient(circle at 40% 80%, rgba(255,0,255,0.08), transparent 45%),
          radial-gradient(circle at 70% 70%, rgba(255,255,0,0.05), transparent 50%)
        `,
      }}
    />
  )
}
