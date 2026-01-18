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
        "fixed inset-0 -z-20 pointer-events-none opacity-0 transition-opacity duration-1000",
        intensity === 'medium' ? "opacity-30 animate-gradient-mesh" : "opacity-20",
        className
      )}
      style={{
        background: `
          radial-gradient(circle at 20% 20%, rgba(0,255,247,0.25) 0%, transparent 40%),
          radial-gradient(circle at 80% 30%, rgba(0,255,136,0.20) 0%, transparent 40%),
          radial-gradient(circle at 40% 80%, rgba(170,0,255,0.15) 0%, transparent 45%),
          radial-gradient(circle at 70% 70%, rgba(255,255,0,0.10) 0%, transparent 50%),
          radial-gradient(circle at 30% 60%, rgba(0,136,255,0.15) 0%, transparent 35%)
        `,
        backgroundSize: '200% 200%',
      }}
    />
  )
}
