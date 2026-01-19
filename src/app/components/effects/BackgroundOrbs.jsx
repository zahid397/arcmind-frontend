'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundOrbs() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let orbs = []

    // Resize canvas safely
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Orb class
    class Orb {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 80 + 40
        this.speedX = Math.random() * 0.4 - 0.2
        this.speedY = Math.random() * 0.4 - 0.2
        this.color = `hsla(${200 + Math.random() * 60}, 70%, 60%, 0.08)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width + this.size) this.x = -this.size
        if (this.x < -this.size) this.x = canvas.width + this.size
        if (this.y > canvas.height + this.size) this.y = -this.size
        if (this.y < -this.size) this.y = canvas.height + this.size
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
        )

        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create orbs
    orbs = Array.from({ length: 6 }, () => new Orb())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw orbs
      orbs.forEach((orb) => {
        orb.update()
        orb.draw()
      })

      // Draw connections
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x
          const dy = orbs[i].y - orbs[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 260) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(120, 200, 255, ${0.08 * (1 - distance / 260)})`
            ctx.lineWidth = 1
            ctx.moveTo(orbs[i].x, orbs[i].y)
            ctx.lineTo(orbs[j].x, orbs[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  )
}
