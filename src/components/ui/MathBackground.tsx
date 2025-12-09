"use client"

import { useEffect, useRef } from 'react'

export default function MathBackground() {
  // 1. Usamos una referencia para conectar con la etiqueta <canvas>
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return // Si no hay canvas, no hacemos nada

    const ctx = canvas.getContext('2d')
    if (!ctx) return // Si no hay pincel, no hacemos nada

    // 2. Configuración inicial
    let animationFrameId: number
    let particles: any[] = [] // Usamos 'any' para evitar peleas con TypeScript por ahora
    const symbols = ['π', '∑', '∫', '∞', '≈', '≠', '√', '∆', '0', '1', 'x', 'y', 'e', '∂']

    // 3. Función para ajustar al tamaño de la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles() // Reiniciamos partículas al cambiar tamaño
    }

    // 4. Lógica de la Partícula (Clásica)
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      symbol: string
      opacity: number

      constructor() {
        // @ts-ignore
        this.x = Math.random() * canvas.width
        // @ts-ignore
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 15 + 10 
        this.speedX = (Math.random() - 0.5) * 0.5 
        this.speedY = (Math.random() - 0.5) * 0.5 
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        this.opacity = Math.random() * 0.3 + 0.1 
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
        ctx.fillStyle = `rgba(100, 116, 139, ${this.opacity})` // Slate-500
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
      // Limpiar pantalla
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dibujar cada partícula
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    // 5. Iniciar todo
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    // 6. Limpieza (cuando te vas de la página)
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