"use client"

import { useEffect, useRef } from 'react'

export default function MathBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: any[] = []
    const symbols = ['π', '∑', '∫', '∞', '≈', '≠', '√', '∆', '0', '1', 'x', 'y', 'e', '∂']

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; symbol: string; opacity: number

      constructor() {
        // @ts-ignore
        this.x = Math.random() * canvas.width
        // @ts-ignore
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 10 
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        // CAMBIO CLAVE: Opacidad más alta (0.2 a 0.5) para que se vea
        this.opacity = Math.random() * 0.3 + 0.2 
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        // @ts-ignore
        if (this.x > canvas.width + 50) this.x = -50
        // @ts-ignore
        if (this.x < -50) this.x = canvas.width + 50
        // @ts-ignore
        if (this.y > canvas.height + 50) this.y = -50
        // @ts-ignore
        if (this.y < -50) this.y = canvas.height + 50
      }

      draw() {
        if (!ctx) return
        // CAMBIO CLAVE: Color Slate-800 (Casi negro) en lugar de gris claro
        ctx.fillStyle = `rgba(30, 41, 59, ${this.opacity})` 
        ctx.font = `${this.size}px Arial`
        ctx.fillText(this.symbol, this.x, this.y)
      }
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-20 bg-slate-50"
    />
  )
}