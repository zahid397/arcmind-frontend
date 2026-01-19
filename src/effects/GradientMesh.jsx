import { useEffect, useRef } from 'react'

const GradientMesh = () => {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const colors = [
      [59, 130, 246],  // blue
      [139, 92, 246],  // purple
      [6, 182, 212],   // cyan
    ]

    class Point {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.25 * dpr
        this.vy = (Math.random() - 0.5) * 0.25 * dpr
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 1.5 + 0.5
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.06)`
        ctx.fill()
      }
    }

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const initPoints = () => {
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 60000), 12)
      pointsRef.current = Array.from({ length: count }, () => new Point())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const pts = pointsRef.current

      pts.forEach(p => {
        p.update()
        p.draw()
      })

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.hypot(dx, dy)

          if (dist < 160) {
            ctx.strokeStyle = `rgba(${pts[i].color[0]},${pts[i].color[1]},${pts[i].color[2]},${0.06 * (1 - dist / 160)})`
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initPoints()

    if (!reduceMotion) animate()

    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: 0.2 }}
    />
  )
}

export default GradientMesh
