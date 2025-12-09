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
    // Símbolos matemáticos para la animación
    const symbols = ['π', '∑', '∫', '∞', '≈', '≠', '√', '∆', '0', '1', 'x', 'y', 'e', '∂', 'λ', 'θ']

    const resizeCanvas = () => {
      // Ajustamos el tamaño al de la sección padre, no a la ventana completa, para evitar scrollbars
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth
        canvas.height = canvas.parentElement.clientHeight
      } else {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      initParticles()
    }

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; symbol: string; opacity: number

      constructor() {
        // @ts-ignore
        this.x = Math.random() * canvas.width
        // @ts-ignore
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 14 // Tamaño entre 14px y 34px (Más grandes para que se vean)
        this.speedX = (Math.random() - 0.5) * 0.5 // Velocidad lenta y elegante
        this.speedY = (Math.random() - 0.5) * 0.5
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
        // OPACIDAD: Entre 0.1 y 0.4 (Sutil pero visible)
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
        // COLOR: Slate-900 (Casi negro) con transparencia.
        // Esto garantiza que se vean sobre fondo blanco.
        ctx.fillStyle = `rgba(15, 23, 42, ${this.opacity})` 
        ctx.font = `${this.size}px Arial`
        ctx.fillText(this.symbol, this.x, this.y)
      }
    }

    const initParticles = () => {
      particles = []
      // Creamos 60 partículas
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      // Limpiamos el canvas en cada cuadro (Transparente)
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
      className="absolute inset-0 w-full h-full -z-20 pointer-events-none"
      // Quitamos el fondo amarillo, ahora es transparente para verse sobre el blanco de la página
    />
  )
}