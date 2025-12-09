"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator, ArrowLeft, Clock, GraduationCap, ChevronRight, PlayCircle } from "lucide-react"

export default function CapitulosPage() {
  
  // Datos de los capítulos (Simulando un curso real)
  const capitulos = [
    {
      id: "01",
      titulo: "Interpolación Polinómica",
      desc: "Aprende a encontrar funciones que pasen exactamente por puntos de datos conocidos usando Lagrange y Newton.",
      duracion: "15 min",
      nivel: "Intermedio",
      color: "blue",
      rutaTeoria: "/capitulos/interpolacion", // Crearemos esto después
      rutaPractica: "/interpolacion/lagrange" // Esto ya existe (Fase 1)
    },
    {
      id: "02",
      titulo: "Ajuste de Curvas (Regresión)",
      desc: "Descubre cómo modelar tendencias y predecir el futuro minimizando el error cuadrático medio.",
      duracion: "20 min",
      nivel: "Fácil",
      color: "orange",
      rutaTeoria: "/capitulos/ajuste",
      rutaPractica: "/ajuste"
    },
    {
      id: "03",
      titulo: "Integración Numérica",
      desc: "Calcula el área bajo la curva de funciones imposibles de integrar analíticamente con Simpson y Trapecio.",
      duracion: "25 min",
      nivel: "Difícil",
      color: "emerald",
      rutaTeoria: "/capitulos/integracion",
      rutaPractica: "/integracion"
    },
    {
      id: "04",
      titulo: "Ecuaciones Diferenciales (EDO)",
      desc: "Simula fenómenos físicos que cambian en el tiempo. Desde la caída libre hasta circuitos eléctricos.",
      duracion: "30 min",
      nivel: "Avanzado",
      color: "indigo",
      rutaTeoria: "/capitulos/edo",
      rutaPractica: "/edo/rk4"
    }
  ]

  // Configuración de colores dinámica
  const getColorClasses = (color: string) => {
    const map: any = {
      blue: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400",
      orange: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400",
      emerald: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-400",
      indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-400",
    }
    return map[color] || map.blue
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-slate-200">
      
      {/* HEADER SIMPLE */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Inicio
            </Button>
          </Link>
          <div className="flex items-center gap-2">
             <GraduationCap className="h-5 w-5 text-slate-900" />
             <span className="font-bold text-slate-900">Plan de Estudio</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Capítulos Teóricos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Antes de calcular, es fundamental entender el "por qué". 
            Selecciona un módulo para dominar la base matemática.
          </p>
        </div>

        <div className="grid gap-6">
          {capitulos.map((cap, index) => (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`group transition-all duration-300 hover:shadow-lg border bg-white overflow-hidden`}>
                <div className="flex flex-col md:flex-row">
                  
                  {/* SECCIÓN IZQUIERDA: ID y DECORACIÓN */}
                  <div className={`md:w-24 flex items-center justify-center bg-slate-100 border-b md:border-b-0 md:border-r border-slate-100 group-hover:bg-white transition-colors`}>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-slate-900 transition-colors">
                      {cap.id}
                    </span>
                  </div>

                  {/* SECCIÓN CENTRAL: CONTENIDO */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <Badge variant="secondary" className={`font-medium ${getColorClasses(cap.color).split(" ")[1]} bg-opacity-10`}>
                        {cap.nivel}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        {cap.duracion} lectura
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {cap.titulo}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-6">
                      {cap.desc}
                    </p>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* 1. Botón Teoría (Futuro) */}
                      <Link href={cap.rutaTeoria}>
                        <Button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 gap-2">
                           <BookOpen className="h-4 w-4" />
                           Leer Teoría
                        </Button>
                      </Link>

                      {/* 2. Botón Práctica (Ya funciona) */}
                      <Link href={cap.rutaPractica}>
                        <Button variant="outline" className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 gap-2 group/btn">
                           <Calculator className="h-4 w-4 text-slate-500 group-hover/btn:text-blue-600 transition-colors" />
                           Ir al Simulador
                           <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  )
}