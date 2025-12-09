"use client"

import { useEffect, useRef } from 'react'

export default function MathBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 1. DIAGNÓSTICO: Mensaje en consola
    console.log("🟢 MathBackground: Iniciando componente...")

    const canvas = canvasRef.current
    if (!canvas) {
        console.error("🔴 Error: No se encontró la referencia al Canvas")
        return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        console.error("🔴 Error: No se pudo obtener el contexto 2D")
        return
    }

    let animationFrameId: number
    let particles: any[] = []
    const symbols = ['π', '∑', '∫', '∞', '≈', '≠', '√', '∆', '0', '1', 'x', 'y']

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; symbol: string

      constructor() {
        // @ts-ignore
        this.x = Math.random() * canvas.width
        // @ts-ignore
        this.y = Math.random() * canvas.height
        this.size = 30 // TAMAÑO GIGANTE PARA PRUEBA
        this.speedX = (Math.random() - 0.5) * 2 // VELOCIDAD RÁPIDA
        this.speedY = (Math.random() - 0.5) * 2
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)]
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
        // COLOR ROJO FOSFORESCENTE PARA PRUEBA
        ctx.fillStyle = 'red' 
        ctx.font = `bold ${this.size}px Arial`
        ctx.fillText(this.symbol, this.x, this.y)
      }
    }

    const initParticles = () => {
      particles = []
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle())
      }
      console.log("🟢 Partículas creadas: ", particles.length)
    }

    const animate = () => {
      // Limpiar con un color amarillo suave para ver si el canvas ocupa espacio
      ctx.fillStyle = '#fff9c4' 
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
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

  // Quitamos clases de Tailwind para asegurar que CSS no lo oculte
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -20, // Muy atrás
        background: 'yellow' // Fondo amarillo de prueba
      }}
    />
  )
}