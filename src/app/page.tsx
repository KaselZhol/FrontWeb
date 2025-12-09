"use client"

// 1. Importamos el componente de fondo animado
import MathBackground from "@/components/ui/MathBackground"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Camera, Brain, ChevronRight, Activity, Sigma, Calculator, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const features = [
    {
      title: "Ecuaciones Diferenciales",
      desc: "Simula sistemas dinámicos con Euler, Heun, Taylor y Runge-Kutta 4.",
      icon: Activity,
      href: "/edo/rk4",
      color: "bg-blue-500/10 text-blue-600",
      border: "border-blue-200"
    },
    {
      title: "Integración Numérica",
      desc: "Calcula áreas bajo la curva con alta precisión usando Simpson y Trapecio.",
      icon: Sigma,
      href: "/integracion",
      color: "bg-emerald-500/10 text-emerald-600",
      border: "border-emerald-200"
    },
    {
      title: "Interpolación",
      desc: "Encuentra el polinomio desconocido a partir de datos dispersos (Lagrange/Newton).",
      icon: Calculator,
      href: "/interpolacion/lagrange",
      color: "bg-purple-500/10 text-purple-600",
      border: "border-purple-200"
    },
    {
      title: "Ajuste de Curvas",
      desc: "Modelado predictivo y regresiones lineales o polinómicas.",
      icon: TrendingUp,
      href: "/ajuste",
      color: "bg-orange-500/10 text-orange-600",
      border: "border-orange-200"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION CON FONDO ANIMADO JS (MATHBACKGROUND) */}
      <section className="relative overflow-hidden pt-32 pb-40 lg:pt-48 lg:pb-56">
        
        {/* 1. AQUÍ ESTÁ EL CAMBIO: Usamos el componente en lugar del video */}
        <MathBackground />

        {/* 2. CAPA DE SUPERPOSICIÓN (OVERLAY) */}
        {/* Usamos white/60 para que se vean bien los símbolos matemáticos del fondo */}
        <div className="absolute inset-0 bg-white/60 -z-10 backdrop-blur-[1px]"></div>
        
        {/* 3. EL CONTENIDO (Texto y botones) */}
        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-white/80 text-slate-700 border border-slate-200 backdrop-blur-md shadow-sm">
              v2.0 • Motor Matemático Harvard
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
              Matemáticas complejas, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                resueltas en segundos.
              </span>
            </h1>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
              La plataforma definitiva para estudiantes de ingeniería. Sube tu problema, 
              deja que la IA lo analice y obtén la solución paso a paso con nuestros algoritmos numéricos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="h-12 px-8 rounded-full text-lg bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20 group">
                Explorar Métodos
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full text-lg border-slate-400 bg-white/50 hover:bg-white text-slate-700 gap-2 backdrop-blur-md transition-all">
                <Camera className="h-5 w-5" />
                Escanear Problema (Beta)
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID (Se mantiene igual) */}
      <section className="py-20 bg-slate-50/80 border-t border-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Laboratorio Numérico</h2>
              <p className="text-slate-500 mt-2">Selecciona un módulo para comenzar a simular.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              <Brain className="h-4 w-4" />
              Potenciado por Python & NumPy
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={feat.href}>
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-blue-300 group ${feat.border} bg-white/80 backdrop-blur-sm`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl ${feat.color} group-hover:scale-110 transition-transform duration-300`}>
                          <feat.icon size={28} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {feat.title}
                          </h3>
                          <p className="text-slate-500 mt-2 leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                        <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                          <ArrowRight className="text-slate-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}