'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particles
    const particles: Particle[] = []
    const particleCount = 50

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        const colors = ['#00ffff', '#ff00ff', '#a855f7', '#00ff41']
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Connection lines
    function connectParticles() {
      if (!ctx) return
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.strokeStyle = '#00ffff'
            ctx.globalAlpha = (1 - distance / 150) * 0.2
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    // Geometric shapes
    const shapes: Shape[] = []

    class Shape {
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      color: string
      opacity: number
      type: 'triangle' | 'square' | 'hexagon'

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 30 + 20
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        const colors = ['#00ffff', '#ff00ff', '#a855f7']
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.1 + 0.05
        const types: Array<'triangle' | 'square' | 'hexagon'> = ['triangle', 'square', 'hexagon']
        this.type = types[Math.floor(Math.random() * types.length)]
      }

      update() {
        this.rotation += this.rotationSpeed
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.strokeStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.lineWidth = 1

        if (this.type === 'triangle') {
          ctx.beginPath()
          ctx.moveTo(0, -this.size / 2)
          ctx.lineTo(this.size / 2, this.size / 2)
          ctx.lineTo(-this.size / 2, this.size / 2)
          ctx.closePath()
          ctx.stroke()
        } else if (this.type === 'square') {
          ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else {
          const sides = 6
          const angle = (Math.PI * 2) / sides
          ctx.beginPath()
          for (let i = 0; i < sides; i++) {
            const x = Math.cos(angle * i) * this.size / 2
            const y = Math.sin(angle * i) * this.size / 2
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        }

        ctx.restore()
        ctx.globalAlpha = 1
      }
    }

    // Create shapes
    for (let i = 0; i < 8; i++) {
      shapes.push(new Shape())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw shapes
      shapes.forEach(shape => {
        shape.update()
        shape.draw()
      })

      // Update and draw particles
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Connect particles
      connectParticles()

      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    function handleResize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
