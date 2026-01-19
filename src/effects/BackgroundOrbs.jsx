import { useEffect, useRef } from 'react'

const BackgroundOrbs = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const colors = [
      'rgba(59, 130, 246, 0.1)',
      'rgba(139, 92, 246, 0.1)',
      'rgba(6, 182, 212, 0.1)'
    ]

    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 80 + 40,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbs.forEach(orb => {
        // Move orb
        orb.x += orb.speedX
        orb.y += orb.speedY

        // Bounce off edges
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size

        // Draw orb
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
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  )
}

export default BackgroundOrbs
