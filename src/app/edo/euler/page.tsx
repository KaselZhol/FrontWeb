"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Activity, Play, RefreshCw } from "lucide-react"

export default function EulerPage() {
  const [params, setParams] = useState({
    ecuacion: "y - t**2 + 1",
    t0: 0,
    y0: 0.5,
    h: 0.1,
    pasos: 10
  })

  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

const calcularModelo = async () => {
    setLoading(true)
    try {
      // ⚠️ IMPORTANTE: Apuntamos a TU URL de Render
      const res = await fetch('https://api-modelado.onrender.com/edo/universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            // 1. Datos básicos
            ecuacion: params.ecuacion,
            t0: params.t0,
            y0: params.y0,
            h: params.h,
            pasos: params.pasos,
            
            // 2. CORRECCIÓN CLAVE: Usa null en lugar de "" (comillas vacías)
            // Python prefiere 'None' (null) para decir "no existe".
            ecuacion_segunda_derivada: null, 
            solucion_exacta: null,

            // 3. SEGURIDAD: Agregamos esto por si tu esquema EDOInput lo requiere obligatoriamente
            metodo: "euler"
        })
      })
      
      if (!res.ok) {
        // Esto nos ayuda a ver el error real si vuelve a fallar
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        throw new Error("Error en la petición");
      }

      const data = await res.json()
      
      // Preparamos datos para la gráfica
      const datosGrafica = data.grafica.t.map((t: number, i: number) => ({
        tiempo: t.toFixed(2),
        valor: data.grafica.y[i]
      }))

      setResultado({ ...data, datosGrafica })
    } catch (error) {
      alert("Error conectando con el servidor. (Revisa la consola con F12 para más detalles)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ENCABEZADO EULER */}
        <div className="flex items-center space-x-4 border-b pb-6">
          <div className="p-3 bg-indigo-600 rounded-lg shadow">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Método de Euler</h1>
            <p className="text-slate-500">Aproximación lineal básica para EDOs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* INPUTS */}
          <Card className="md:col-span-4 h-fit">
            <CardHeader>
              <CardTitle>Parámetros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ecuación (y')</Label>
                <Input value={params.ecuacion} onChange={(e) => setParams({...params, ecuacion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>t0</Label><Input type="number" value={params.t0} onChange={(e) => setParams({...params, t0: parseFloat(e.target.value)})} /></div>
                <div><Label>y0</Label><Input type="number" value={params.y0} onChange={(e) => setParams({...params, y0: parseFloat(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Paso (h)</Label><Input type="number" value={params.h} onChange={(e) => setParams({...params, h: parseFloat(e.target.value)})} /></div>
                <div><Label>Iteraciones</Label><Input type="number" value={params.pasos} onChange={(e) => setParams({...params, pasos: parseInt(e.target.value)})} /></div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={calcularModelo} disabled={loading}>
                {loading ? <RefreshCw className="animate-spin mr-2"/> : <Play className="mr-2 h-4 w-4"/>} Calcular
              </Button>
            </CardContent>
          </Card>

          {/* RESULTADOS */}
          <div className="md:col-span-8 space-y-6">
            <Card>
              <CardContent className="h-[350px] pt-6">
                {resultado ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={resultado.datosGrafica}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tiempo" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="valor" stroke="#4f46e5" strokeWidth={3} dot={{r:3}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : <div className="h-full flex items-center justify-center text-slate-400">Esperando simulación...</div>}
              </CardContent>
            </Card>

            {resultado && (
               <Card>
                 <CardHeader><CardTitle>Iteraciones</CardTitle></CardHeader>
                 <CardContent>
                   <div className="bg-slate-100 p-4 rounded h-[200px] overflow-y-auto font-mono text-xs text-slate-700">
                     {resultado.pasos.map((p:string, i:number) => <div key={i} className="border-b py-1">{p}</div>)}
                   </div>
                 </CardContent>
               </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}