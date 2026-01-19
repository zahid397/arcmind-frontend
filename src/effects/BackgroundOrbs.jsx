import { useEffect, useRef } from 'react'

const BackgroundOrbs = () => {
  const canvasRef = useRef(null)
  const orbsRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const colors = [
      { r: 59, g: 130, b: 246, a: 0.08 },
      { r: 139, g: 92, b: 246, a: 0.08 },
      { r: 6, g: 182, b: 212, a: 0.08 },
    ]

    class Orb {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 80 + 40
        this.speedX = (Math.random() * 0.3 - 0.15) * dpr
        this.speedY = (Math.random() * 0.3 - 0.15) * dpr
        this.color = colors[Math.floor(Math.random() * colors.length)]
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
        const g = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        )
        g.addColorStop(0, `rgba(${this.color.r},${this.color.g},${this.color.b},${this.color.a})`)
        g.addColorStop(1, `rgba(${this.color.r},${this.color.g},${this.color.b},0)`)

        ctx.beginPath()
        ctx.fillStyle = g
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const resize = () => {
      const { innerWidth, innerHeight } = window
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width = `${innerWidth}px`
      canvas.style.height = `${innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const initOrbs = () => {
      const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 150000), 6)
      orbsRef.current = Array.from({ length: count }, () => new Orb())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbsRef.current.forEach(o => {
        o.update()
        o.draw()
      })

      for (let i = 0; i < orbsRef.current.length; i++) {
        for (let j = i + 1; j < orbsRef.current.length; j++) {
          const a = orbsRef.current[i]
          const b = orbsRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)

          if (dist < 250) {
            ctx.strokeStyle = `rgba(100,200,255,${0.08 * (1 - dist / 250)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    resize()
    initOrbs()

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
      style={{ opacity: 0.3 }}
    />
  )
}

export default BackgroundOrbs
