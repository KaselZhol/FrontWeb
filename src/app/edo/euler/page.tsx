"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Activity, Play, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Importamos el Escáner Híbrido
import ProblemScanner from "@/components/ProblemScanner"

// 1. COMPONENTE INTERNO (Lógica)
function EulerContent() {
  const searchParams = useSearchParams()

  const [params, setParams] = useState({
    ecuacion: "y - t**2 + 1",
    t0: 0,
    y0: 0.5,
    h: 0.1,
    pasos: 10,
    metodo: "euler",
    segundaDerivada: "0"
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

  // B. FUNCIÓN PARA EL ESCÁNER INTERNO
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

  const calcularModelo = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://api-modelado.onrender.com/edo/universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ecuacion: params.ecuacion,
            t0: params.t0,
            y0: params.y0,
            h: params.h,
            pasos: params.pasos,
            metodo: params.metodo, 
            ecuacion_segunda_derivada: params.metodo === "taylor2" ? params.segundaDerivada : "0",
            solucion_exacta: "0"
        })
      })
      
      const data = await res.json()
      
      if (data.detail) throw new Error(data.detail)

      const datosGrafica = data.grafica.x.map((x_val: number, i: number) => ({
        tiempo: x_val.toFixed(2),
        valor: data.grafica.y[i]
      }))

      setResultado({ ...data, datosGrafica })
    } catch (error) {
      console.error(error)
      alert("Error al procesar los datos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-600 rounded-lg shadow">
                    <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Métodos de un Paso</h1>
                    <p className="text-slate-500">Euler (Orden 1) y Series de Taylor (Orden 2)</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* INPUTS */}
          <Card className="md:col-span-4 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Configuración</CardTitle>
              {/* BOTÓN ESCÁNER INTERNO */}
              <div className="scale-90 origin-right">
                  <ProblemScanner onScanComplete={handleAutocompletar} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-4">
              
              <div>
                <Label className="mb-2 block text-slate-700">Método Numérico</Label>
                <Select 
                    value={params.metodo} 
                    onValueChange={(val) => setParams({...params, metodo: val})}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="euler">Método de Euler</SelectItem>
                        <SelectItem value="taylor2">Serie de Taylor (Orden 2)</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ecuación (y')</Label>
                <Input 
                    value={params.ecuacion} 
                    onChange={(e) => setParams({...params, ecuacion: e.target.value})} 
                    placeholder="Ej: y - t"
                />
              </div>

              {/* INPUT CONDICIONAL TAYLOR */}
              {params.metodo === "taylor2" && (
                  <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-blue-700 font-semibold">Segunda Derivada (y'')</Label>
                    <Input 
                        value={params.segundaDerivada} 
                        onChange={(e) => setParams({...params, segundaDerivada: e.target.value})} 
                        placeholder="ej: 1 + yp"
                        className="bg-white border-blue-200 focus-visible:ring-blue-400"
                    />
                    <p className="text-xs text-blue-500">
                        Tip: Puedes usar <b>yp</b> para representar y'.
                    </p>
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><Label>t0</Label><Input type="number" value={params.t0} onChange={(e) => setParams({...params, t0: parseFloat(e.target.value)})} /></div>
                <div><Label>y0</Label><Input type="number" value={params.y0} onChange={(e) => setParams({...params, y0: parseFloat(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Paso (h)</Label><Input type="number" value={params.h} onChange={(e) => setParams({...params, h: parseFloat(e.target.value)})} /></div>
                <div><Label>Iteraciones</Label><Input type="number" value={params.pasos} onChange={(e) => setParams({...params, pasos: parseInt(e.target.value)})} /></div>
              </div>
              
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={calcularModelo} disabled={loading}>
                {loading ? <RefreshCw className="animate-spin mr-2"/> : <Play className="mr-2 h-4 w-4"/>} 
                {loading ? "Calculando..." : "Ejecutar"}
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
                      <XAxis dataKey="tiempo" label={{ value: 't', position: 'insideBottomRight', offset: -5 }}/>
                      <YAxis domain={['auto', 'auto']} label={{ value: 'y', angle: -90, position: 'insideLeft' }}/>
                      <Tooltip />
                      <Line type="monotone" dataKey="valor" stroke="#4f46e5" strokeWidth={3} dot={{r:3}} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                        <Activity className="h-10 w-10 mb-2 opacity-20" />
                        <p>Selecciona un método y calcula</p>
                    </div>
                )}
              </CardContent>
            </Card>

            {resultado && (
               <Card>
                 <CardHeader><CardTitle className="text-sm uppercase tracking-wider text-slate-500">Procedimiento Paso a Paso</CardTitle></CardHeader>
                 <CardContent>
                   <div className="bg-slate-100 p-4 rounded h-[250px] overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap border border-slate-200">
                     {resultado.pasos.map((p:string, i:number) => (
                        <div key={i} className="mb-3 border-b border-slate-200 pb-2 last:border-0 last:mb-0 last:pb-0">
                            {p}
                        </div>
                     ))}
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

// 2. ENVOLTORIO SUSPENSE
export default function EulerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-indigo-600">Cargando Laboratorio...</div>}>
      <EulerContent />
    </Suspense>
  )
}