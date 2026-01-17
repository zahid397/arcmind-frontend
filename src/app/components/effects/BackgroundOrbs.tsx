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

export default function BackgroundOrbs({
  count = 8,
  intensity = 'medium',
  className,
}: BackgroundOrbsProps) {
  const shouldReduceMotion = useReducedMotion()
  const [orbs, setOrbs] = useState<Orb[]>([])

  const colorMap = useMemo(
    () => ({
      neon: [
        'rgba(0, 255, 247, 0.15)', // cyan
        'rgba(0, 255, 0, 0.15)', // green
        'rgba(255, 0, 255, 0.15)', // pink
        'rgba(255, 255, 0, 0.10)', // yellow
        'rgba(0, 100, 255, 0.10)', // blue
      ],
    }),
    []
  )

  const intensityMap = useMemo(
    () => ({
      low: { defaultCount: 4, opacity: 0.06, blur: 22 },
      medium: { defaultCount: 8, opacity: 0.10, blur: 40 },
      high: { defaultCount: 12, opacity: 0.14, blur: 60 },
    }),
    []
  )

  // ✅ Only regenerate when count/intensity changes (NOT on resize)
  useEffect(() => {
    const cfg = intensityMap[intensity]
    const finalCount = typeof count === 'number' ? count : cfg.defaultCount

    const newOrbs: Orb[] = Array.from({ length: finalCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
      color: colorMap.neon[Math.floor(Math.random() * colorMap.neon.length)],
      speed: Math.random() * 2 + 1,
    }))

    setOrbs(newOrbs)
  }, [count, intensity, colorMap, intensityMap])

  const cfg = intensityMap[intensity]

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
                  x: [0, Math.sin(orb.id * 0.5) * 100, Math.cos(orb.id * 0.3) * 80, 0],
                  y: [0, Math.cos(orb.id * 0.5) * 80, Math.sin(orb.id * 0.3) * 100, 0],
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
        />
      ))}
    </div>
  )
}
