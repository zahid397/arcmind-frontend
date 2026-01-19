// effects/BackgroundOrbs.jsx
import { useEffect, useRef } from 'react'

export default function BackgroundOrbs() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const colors = [
      'rgba(59, 130, 246, 0.1)',
      'rgba(139, 92, 246, 0.1)',
      'rgba(6, 182, 212, 0.1)'
    ]

    const orbs = Array.from({ length: 4 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 60 + 40,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach(orb => {
        orb.x += orb.speedX
        orb.y += orb.speedY

        if (orb.x > window.innerWidth + orb.size) orb.x = -orb.size
        if (orb.x < -orb.size) orb.x = window.innerWidth + orb.size
        if (orb.y > window.innerHeight + orb.size) orb.y = -orb.size
        if (orb.y < -orb.size) orb.y = window.innerHeight + orb.size

        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.size
        )
        gradient.addColorStop(0, orb.color)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}
