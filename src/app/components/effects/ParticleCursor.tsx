'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { cn } from '@/app/lib/utils'

interface ParticleCursorProps {
  enabled?: boolean
  className?: string
  size?: number
  color?: string
  smoothing?: number
}

interface Particle {
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  life: number
}

export default function ParticleCursor({
  enabled = false,
  className,
  size = 4,
  color = 'rgba(0, 243, 255, 0.8)',
  smoothing = 0.15,
}: ParticleCursorProps) {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const containerRectRef = useRef<DOMRect | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 })
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const lastEmitTimeRef = useRef<number>(0)

  // Initialize client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update container rect ref (FIX 1: Cache rect)
  useEffect(() => {
    if (!containerRef.current || !isClient) return
    
    const updateRect = () => {
      if (containerRef.current) {
        containerRectRef.current = containerRef.current.getBoundingClientRect()
      }
    }
    
    updateRect()
    window.addEventListener('resize', updateRect)
    
    return () => {
      window.removeEventListener('resize', updateRect)
    }
  }, [isClient])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRectRef.current) return

    mouseRef.current.x = e.clientX - containerRectRef.current.left
    mouseRef.current.y = e.clientY - containerRectRef.current.top
    
    // Calculate velocity
    mouseRef.current.vx = e.movementX || 0
    mouseRef.current.vy = e.movementY || 0

    // Throttle particle creation (FIX 3: Optional throttle)
    const now = performance.now()
    if (now - lastEmitTimeRef.current < 16) return // ~60fps throttle
    
    const speed = Math.sqrt(mouseRef.current.vx ** 2 + mouseRef.current.vy ** 2)
    const particleCount = Math.min(Math.floor(speed * 0.5), 5)

    // Safety check: don't create too many particles
    if (speed > 3 && particles.length < 80) {
      const newParticles: Particle[] = Array.from({ length: particleCount }, () => ({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        size: Math.random() * size + size,
        color: color.replace('0.8', (Math.random() * 0.4 + 0.3).toFixed(2)),
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1.0,
      }))
      
      setParticles(prev => [...prev.slice(-50), ...newParticles])
      lastEmitTimeRef.current = now
    }
  }, [size, color, particles.length])

  // Animation loop
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time
    const delta = time - lastTimeRef.current
    lastTimeRef.current = time

    setParticles(prev => {
      const rect = containerRectRef.current
      if (!rect) return prev

      const updated = prev.map(p => {
        // Update position with velocity
        let newX = p.x + p.vx
        let newY = p.y + p.vy
        
        // Apply physics
        p.vx *= 0.95
        p.vy *= 0.95
        p.vy += 0.1
        
        // Decrease life
        p.life -= delta * 0.002
        
        // Bounce off container edges (FIX 2: Use container bounds)
        if (newX < 0 || newX > rect.width) p.vx *= -0.8
        if (newY < 0 || newY > rect.height) p.vy *= -0.8
        
        // Constrain to container bounds
        newX = Math.max(0, Math.min(newX, rect.width))
        newY = Math.max(0, Math.min(newY, rect.height))
        
        return { ...p, x: newX, y: newY }
      })
      
      // Filter out dead particles
      return updated.filter(p => p.life > 0)
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  // Setup and cleanup
  useEffect(() => {
    if (!isClient || !enabled) return

    // Check if should disable
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (isTouchDevice || prefersReducedMotion) {
      return
    }

    // Initialize timers
    lastEmitTimeRef.current = performance.now()
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove)
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      setParticles([]) // Clear particles on unmount
    }
  }, [isClient, enabled, handleMouseMove, animate])

  // Don't render on server
  if (!isClient || !enabled) return null

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Main cursor */}
      <div 
        className={cn(
          'fixed pointer-events-none',
          'w-3 h-3 rounded-full',
          'bg-neon-cyan transition-transform duration-75',
          className
        )}
        style={{
          left: mouseRef.current.x - 6,
          top: mouseRef.current.y - 6,
          boxShadow: `
            0 0 12px rgba(0,255,255,0.8),
            0 0 24px rgba(0,255,255,0.6),
            0 0 48px rgba(0,255,255,0.4)
          `,
        }}
      />

      {/* Particles */}
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transition: 'opacity 0.1s, transform 0.1s',
          }}
        />
      ))}
    </div>
  )
}
