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
    // Agregamos más símbolos griegos para que se vea más "científico"
    const symbols = ['π', '∑', '∫', '∞', '≈', '≠', '√', '∆', 'λ', 'θ', 'Ω', '∂', 'f(x)']

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
        this.size = Math.random() * 20 + 15 // Tamaño legible
        this.speedX = (Math.random() - 0.5) * 0.8 
        this.speedY = (Math.random() - 0.5) * 0.8
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        // CAMBIO DE OPACIDAD: Entre 15% y 40%. Perfecto para fondo.
        this.opacity = Math.random() * 0.25 + 0.15 
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        // @ts-ignore
        if (this.x > canvas.width) this.x = 0
        // @ts-ignore
        if (this.x < 0) this.x = canvas.width
        // @ts-ignore
        if (this.y > canvas.height) this.y = 0
        // @ts-ignore
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        // CAMBIO DE COLOR: Usamos un 'Slate-600' (Azul grisáceo) en vez de negro puro.
        // Se ve mucho más moderno y tecnológico.
        ctx.fillStyle = `rgba(71, 85, 105, ${this.opacity})` 
        ctx.font = `500 ${this.size}px 'Geist Mono', monospace, Arial` // Fuente monoespaciada si es posible
        ctx.fillText(this.symbol, this.x, this.y)
      }
    }

    const initParticles = () => {
      particles = []
      // 70 partículas para llenar bien la pantalla sin saturar
      for (let i = 0; i < 70; i++) {
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
      className="w-full h-full block"
    />
  )
}