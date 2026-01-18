'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/app/lib/utils'

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
  speed: number
}

interface BackgroundOrbsProps {
  count?: number
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

// ✅ Constants outside component for better performance
const COLOR_MAP = {
  neon: [
    'rgba(0, 243, 255, 0.15)', // neon-cyan
    'rgba(0, 255, 136, 0.15)', // neon-green
    'rgba(170, 0, 255, 0.15)', // neon-purple
    'rgba(255, 255, 0, 0.10)', // yellow
    'rgba(0, 136, 255, 0.10)', // neon-blue
  ],
}

const INTENSITY_MAP = {
  low: { defaultCount: 4, opacity: 0.06, blur: 22 },
  medium: { defaultCount: 8, opacity: 0.10, blur: 40 },
  high: { defaultCount: 12, opacity: 0.14, blur: 60 },
} as const

export default function BackgroundOrbs({
  count,
  intensity = 'medium',
  className,
}: BackgroundOrbsProps) {
  const shouldReduceMotion = useReducedMotion()
  const [orbs, setOrbs] = useState<Orb[]>([])

  // ✅ Calculate final count with fallback
  const finalCount = useMemo(() => {
    if (typeof count === 'number' && count > 0) {
      return Math.min(count, 20) // Limit to 20 for performance
    }
    return INTENSITY_MAP[intensity].defaultCount
  }, [count, intensity])

  // ✅ Generate orbs only when dependencies change
  useEffect(() => {
    const newOrbs: Orb[] = Array.from({ length: finalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      color: COLOR_MAP.neon[Math.floor(Math.random() * COLOR_MAP.neon.length)],
      speed: Math.random() * 2 + 1,
    }))

    setOrbs(newOrbs)
  }, [finalCount])

  const cfg = INTENSITY_MAP[intensity]

  // ✅ Pre-render check for SSR
  if (typeof window === 'undefined') {
    return (
      <div className={cn('fixed inset-0 -z-10 overflow-hidden pointer-events-none', className)} />
    )
  }

  return (
    <div
      className={cn(
        'fixed inset-0 -z-10 overflow-hidden pointer-events-none',
        className
      )}
    >
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${cfg.blur}px)`,
            opacity: cfg.opacity,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [
                    0,
                    Math.sin(orb.id * 0.5) * 60,
                    Math.cos(orb.id * 0.3) * 40,
                    0,
                  ],
                  y: [
                    0,
                    Math.cos(orb.id * 0.5) * 40,
                    Math.sin(orb.id * 0.3) * 60,
                    0,
                  ],
                  scale: [1, 1.2, 0.85, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 18 + orb.speed * 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }
          }
          // ✅ Add initial animation state
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        />
      ))}
    </div>
  )
}
