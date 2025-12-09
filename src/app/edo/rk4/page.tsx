"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Activity } from "lucide-react"

// Importamos el Escáner para usarlo dentro de la página también
import ProblemScanner from "@/components/ProblemScanner"

// 1. LÓGICA DEL COMPONENTE (Encapsulada)
function RK4Content() {
  const searchParams = useSearchParams()

  const [params, setParams] = useState({
    ecuacion: "y - t**2 + 1",
    t0: 0, 
    y0: 0.5, 
    h: 0.1, 
    pasos: 10,
    metodo: "rk4" // Aseguramos que el método sea RK4
  })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // A. EFECTO MAGICO: Detectar datos de la IA desde la URL (Home -> Redirección)
  useEffect(() => {
    if (searchParams.get("ecuacion")) {
        setParams(prev => ({
            ...prev,
            ecuacion: searchParams.get("ecuacion") || prev.ecuacion,
            t0: searchParams.get("t0") ? parseFloat(searchParams.get("t0")!) : prev.t0,
            y0: searchParams.get("y0") ? parseFloat(searchParams.get("y0")!) : prev.y0,
            h: searchParams.get("h") ? parseFloat(searchParams.get("h")!) : prev.h,
            pasos: searchParams.get("n") ? parseInt(searchParams.get("n")!) : prev.pasos
        }))
    }
  }, [searchParams])

  // B. FUNCIÓN PARA EL ESCÁNER INTERNO (Escanear estando ya en la página)
  const handleAutocompletar = (datosIA: any) => {
    setParams(prev => ({
        ...prev,
        ecuacion: datosIA.ecuacion || prev.ecuacion,
        t0: datosIA.t0 !== null ? datosIA.t0 : prev.t0,
        y0: datosIA.y0 !== null ? datosIA.y0 : prev.y0,
        h: datosIA.h !== null ? datosIA.h : prev.h,
        pasos: datosIA.n !== null ? datosIA.n : prev.pasos
    }))
  }

  const calcular = async () => {
    setLoading(true)
    try {
      // Usamos el endpoint universal que creamos en la Fase 1
      const res = await fetch('https://api-modelado.onrender.com/edo/rk4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...params,
            metodo: "rk4", // Forzamos RK4 explícitamente
            solucion_exacta: "0" // Opcional
        })
      })
      
      const data = await res.json()
      
      if (data.detail) throw new Error(data.detail)

      // Adaptamos la respuesta para la gráfica (Backend devuelve grafica.x, Frontend usa 'tiempo')
      const datosGrafica = data.grafica.x.map((x_val: number, i: number) => ({
        tiempo: x_val.toFixed(2),
        valor: data.grafica.y[i]
      }))
      
      setResultado({ ...data, datosGrafica })
    } catch (e) { 
        console.error(e)
        alert("Error al calcular. Revisa la ecuación.") 
    } 
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 rounded-lg shadow"><Activity className="text-white"/></div>
                <h1 className="text-3xl font-bold text-slate-900">Runge-Kutta (Orden 4)</h1>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PANEL DE CONTROL */}
          <Card className="md:col-span-4 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Parámetros</CardTitle>
                {/* BOTÓN ESCÁNER PEQUEÑO */}
                <div className="scale-90 origin-right">
                    <ProblemScanner onScanComplete={handleAutocompletar} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              <div>
                  <Label>Ecuación (dy/dt)</Label>
                  <Input 
                    value={params.ecuacion} 
                    onChange={e => setParams({...params, ecuacion: e.target.value})} 
                    placeholder="Ej: y - t**2 + 1"
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>t0 (Inicio)</Label><Input type="number" value={params.t0} onChange={e => setParams({...params, t0: parseFloat(e.target.value)})}/></div>
                 <div><Label>y0 (Valor)</Label><Input type="number" value={params.y0} onChange={e => setParams({...params, y0: parseFloat(e.target.value)})}/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>h (Paso)</Label><Input type="number" value={params.h} onChange={e => setParams({...params, h: parseFloat(e.target.value)})}/></div>
                 <div><Label>N (Pasos)</Label><Input type="number" value={params.pasos} onChange={e => setParams({...params, pasos: parseInt(e.target.value)})}/></div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={calcular} disabled={loading}>
                 {loading ? "Calculando..." : "Ejecutar RK4"}
              </Button>
            </CardContent>
          </Card>

          {/* RESULTADOS */}
          <div className="md:col-span-8 space-y-6">
            
            {/* GRÁFICA */}
            <Card>
               <CardContent className="h-[350px] pt-6">
                  {resultado ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={resultado.datosGrafica}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="tiempo" label={{ value: 't', position: 'insideBottomRight', offset: -5 }} />
                        <YAxis label={{ value: 'y', angle: -90, position: 'insideLeft' }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="valor" stroke="#4f46e5" strokeWidth={3} dot={{r:3, fill:"#4f46e5"}} activeDot={{r:6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                        <Activity className="h-10 w-10 mb-2 opacity-20" />
                        <p>Ingresa parámetros o escanea un problema</p>
                    </div>
                  )}
               </CardContent>
            </Card>
            
            {/* PASO A PASO */}
            {resultado && (
               <Card className="bg-slate-50 border-slate-200">
                  <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-slate-500">Historial de Iteraciones</CardTitle></CardHeader>
                  <CardContent className="h-[200px] overflow-y-auto font-mono text-xs p-4">
                     {resultado.pasos.map((p:string, i:number) => (
                        <div key={i} className="mb-2 border-b border-slate-200 pb-2 last:border-0 text-slate-700">
                            {p}
                        </div>
                     ))}
                  </CardContent>
               </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. ENVOLTORIO SUSPENSE (Obligatorio en Next.js para leer URL)
export default function RK4Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-indigo-600">Cargando Laboratorio...</div>}>
      <RK4Content />
    </Suspense>
  )
}