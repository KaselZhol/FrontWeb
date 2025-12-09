"use client"

import MathBackground from "@/components/MathBackground" 
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Camera, Brain, ChevronRight, Activity, Sigma, Calculator, TrendingUp, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const features = [
    { 
      title: "Ecuaciones Diferenciales", 
      desc: "Simula sistemas dinámicos con Euler, Taylor y RK4.", 
      icon: Activity, 
      href: "/edo/rk4", 
      // Gradientes sutiles en los iconos
      color: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600", 
      border: "hover:border-blue-400 hover:shadow-blue-100" 
    },
    { 
      title: "Integración Numérica", 
      desc: "Cálculo de áreas con Simpson y Trapecio.", 
      icon: Sigma, 
      href: "/integracion", 
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600", 
      border: "hover:border-emerald-400 hover:shadow-emerald-100" 
    },
    { 
      title: "Interpolación", 
      desc: "Lagrange y Newton para datos dispersos.", 
      icon: Calculator, 
      href: "/interpolacion/lagrange", 
      color: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600", 
      border: "hover:border-purple-400 hover:shadow-purple-100" 
    },
    { 
      title: "Ajuste de Curvas", 
      desc: "Regresiones y proyecciones estadísticas.", 
      icon: TrendingUp, 
      href: "/ajuste", 
      color: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600", 
      border: "hover:border-orange-400 hover:shadow-orange-100" 
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden">

        {/* --- CAPA 0: CANVAS (FONDO) --- */}
        <div className="absolute inset-0 z-0 h-[120vh]"> {/* Un poco más alto para cubrir scroll */}
            <MathBackground />
        </div>

        {/* --- CAPA 1: EL TRUCO DEL GRADIENTE RADIAL --- */}
        {/* Esto hace que el centro sea blanco (para leer) y los bordes transparentes (para ver math) */}
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 via-white/80 to-white backdrop-blur-[1px]"></div>
        
        {/* --- CAPA 2: CONTENIDO --- */}
        <div className="relative z-20 pt-32 pb-32 lg:pt-48 lg:pb-40 max-w-5xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* BADGE ANIMADO */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-8 hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Motor v2.0 Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm leading-tight">
              Ingeniería Numérica <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">
                De Nueva Generación
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Resuelve problemas complejos de cálculo y ecuaciones diferenciales con algoritmos de grado Harvard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/capitulos">
                <Button size="lg" className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 text-base group transition-all">
                  <Zap className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  Comenzar Ahora
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-white/50 hover:bg-white text-slate-700 border-slate-300 hover:border-blue-400 backdrop-blur-sm text-base transition-all">
                <Camera className="mr-2 h-5 w-5 text-blue-600" /> Escanear (Beta)
              </Button>
            </div>

          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white relative z-20">
        <div className="absolute inset-0 bg-slate-50/50 skew-y-3 -z-10 origin-top-left transform scale-110"></div>
        
        <div className="max-w-6xl mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Suite de Herramientas</h2>
                <p className="text-slate-500 mt-2 text-lg">Selecciona el método numérico que necesitas.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={feat.href}>
                  <Card className={`h-full border border-slate-100 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer group ${feat.border}`}>
                    <CardContent className="p-8 flex items-start gap-6">
                      <div className={`p-4 rounded-2xl ${feat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <feat.icon size={32} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {feat.title}
                          </h3>
                          <p className="text-slate-500 mt-2 leading-relaxed">
                            {feat.desc}
                          </p>
                      </div>
                      <div className="self-center">
                        <div className="p-2 rounded-full bg-slate-50 group-hover:bg-blue-50 transition-colors">
                           <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
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
      
      {/* FOOTER SIMPLE */}
      <footer className="py-8 text-center text-slate-400 text-sm bg-white border-t border-slate-100">
        <p>© 2024 Harvard Math Engine. Powered by Next.js & Python.</p>
      </footer>
    </div>
  )
}