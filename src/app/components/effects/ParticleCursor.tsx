'use client'

import { useEffect } from 'react'
import { cn } from '@/app/lib/utils'

interface ParticleCursorProps {
  enabled?: boolean
  className?: string
}

export default function ParticleCursor({
  enabled = true,
  className,
}: ParticleCursorProps) {
  useEffect(() => {
    // ❌ Disable on mobile & touch devices
    if (!enabled || 'ontouchstart' in window) return

    const cursor = document.createElement('div')
    cursor.className = cn(
      'fixed pointer-events-none z-[100]',
      'w-3 h-3 rounded-full',
      'bg-neon-cyan',
      className
    )

    cursor.style.boxShadow = `
      0 0 12px rgba(0,255,255,0.8),
      0 0 24px rgba(0,255,255,0.6),
      0 0 48px rgba(0,255,255,0.4)
    `

    document.body.appendChild(cursor)

    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const move = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const animate = () => {
      // smooth follow (lerp)
      x += (targetX - x) * 0.15
      y += (targetY - y) * 0.15

      cursor.style.transform = `translate(${x - 6}px, ${y - 6}px)`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move)
    animate()

    return () => {
      window.removeEventListener('mousemove', move)
      cursor.remove()
    }
  }, [enabled, className])

  return null
}
