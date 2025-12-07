"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Activity, Play, RefreshCw } from "lucide-react"

export default function RK4Page() {
  const [params, setParams] = useState({
    ecuacion: "y - t**2 + 1",
    t0: 0, y0: 0.5, h: 0.1, pasos: 10
  })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    setLoading(true)
    try {
      // ⚠️ URL DE PRODUCCIÓN CORRECTA
      const res = await fetch('https://api-modelado.onrender.com/edo/rk4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      const data = await res.json()
      
      const datosGrafica = data.grafica.t.map((t: number, i: number) => ({
        tiempo: t.toFixed(2), valor: data.grafica.y[i]
      }))
      setResultado({ ...data, datosGrafica })
    } catch (e) { alert("Error conectando con Render") } 
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 border-b pb-6">
          <div className="p-3 bg-slate-900 rounded-lg shadow"><Activity className="text-white"/></div>
          <h1 className="text-3xl font-bold text-slate-900">Runge-Kutta (Orden 4)</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-4 h-fit">
            <CardHeader><CardTitle>Parámetros RK4</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Ecuación</Label><Input value={params.ecuacion} onChange={e => setParams({...params, ecuacion: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>t0</Label><Input type="number" value={params.t0} onChange={e => setParams({...params, t0: parseFloat(e.target.value)})}/></div>
                 <div><Label>y0</Label><Input type="number" value={params.y0} onChange={e => setParams({...params, y0: parseFloat(e.target.value)})}/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div><Label>h</Label><Input type="number" value={params.h} onChange={e => setParams({...params, h: parseFloat(e.target.value)})}/></div>
                 <div><Label>N</Label><Input type="number" value={params.pasos} onChange={e => setParams({...params, pasos: parseInt(e.target.value)})}/></div>
              </div>
              <Button className="w-full bg-slate-900" onClick={calcular} disabled={loading}>
                 {loading ? "Calculando..." : "Ejecutar RK4"}
              </Button>
            </CardContent>
          </Card>

          <div className="md:col-span-8 space-y-6">
            <Card>
               <CardContent className="h-[350px] pt-6">
                  {resultado ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={resultado.datosGrafica}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="tiempo"/>
                        <YAxis domain={['auto','auto']}/>
                        <Tooltip/>
                        <Line type="monotone" dataKey="valor" stroke="#0f172a" strokeWidth={3} dot={{r:3}}/>
                      </LineChart>
                    </ResponsiveContainer>
                  ) : <div className="h-full flex items-center justify-center text-slate-400">Gráfica RK4</div>}
               </CardContent>
            </Card>
            {resultado && (
               <Card className="bg-slate-100 p-4 h-[200px] overflow-y-auto font-mono text-xs">
                  {resultado.pasos.map((p:string, i:number) => <div key={i} className="mb-2 border-b pb-1">{p}</div>)}
               </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}