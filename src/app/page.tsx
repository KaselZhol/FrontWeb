"use client"

// 👇 VERIFICA ESTA RUTA: Si tu archivo está en 'components/ui', agrega el /ui/
import MathBackground from "@/components/MathBackground" 

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Camera, Brain, ChevronRight, Activity, Sigma, Calculator, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const features = [
    { title: "Ecuaciones Diferenciales", desc: "Simula sistemas dinámicos.", icon: Activity, href: "/edo/rk4", color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
    { title: "Integración Numérica", desc: "Calcula áreas bajo la curva.", icon: Sigma, href: "/integracion", color: "bg-emerald-100 text-emerald-600", border: "border-emerald-200" },
    { title: "Interpolación", desc: "Lagrange y Newton.", icon: Calculator, href: "/interpolacion/lagrange", color: "bg-purple-100 text-purple-600", border: "border-purple-200" },
    { title: "Ajuste de Curvas", desc: "Regresiones lineales.", icon: TrendingUp, href: "/ajuste", color: "bg-orange-100 text-orange-600", border: "border-orange-200" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      {/* Usamos 'relative' para contener las capas absolutas */}
      <section className="relative w-full h-auto overflow-hidden">

        {/* --- CAPA 0 (FONDO): EL CANVAS --- */}
        <div className="absolute inset-0 z-0">
            <MathBackground />
        </div>

        {/* --- CAPA 1 (MEDIO): EL COLOR BLANCO TRANSPARENTE --- */}
        {/* z-10 asegura que esté ENCIMA del canvas */}
        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px]"></div>
        
        {/* --- CAPA 2 (FRENTE): EL CONTENIDO --- */}
        {/* z-20 asegura que esté ENCIMA de todo lo anterior */}
        <div className="relative z-20 pt-32 pb-40 lg:pt-48 lg:pb-56 max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full bg-white/80 text-slate-700 border border-slate-200 shadow-sm">
              v2.0 • Motor Matemático Harvard
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
              Matemáticas complejas, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                resueltas en segundos.
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              La plataforma definitiva para estudiantes de ingeniería.
            </p>

            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-12 px-8 rounded-full bg-slate-900 hover:bg-slate-800 shadow-xl group">
                Explorar Métodos <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 rounded-full bg-white/60 hover:bg-white text-slate-700 border-slate-400">
                <Camera className="mr-2 h-5 w-5" /> Escanear Problema
              </Button>
            </div>

          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-slate-50/90 border-t border-slate-200 relative z-20">
        <div className="max-w-6xl mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, i) => (
              <Link href={feat.href} key={i}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer border hover:border-blue-400 bg-white group">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${feat.color} group-hover:scale-110 transition-transform`}><feat.icon size={28}/></div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                        <p className="text-slate-500 mt-1">{feat.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
           </div>
        </div>
      </section>
    </div>
  )
}