"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Scatter 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, ArrowRight } from "lucide-react"

// Importamos el Escáner
import ProblemScanner from "@/components/ProblemScanner"

// 1. LÓGICA INTERNA
function LagrangeContent() {
  const searchParams = useSearchParams()

  const [inputs, setInputs] = useState({
    x_str: "0, 1, 3",
    y_str: "1, 2, 0",
    x_eval: 2.0
  })

  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // A. EFECTO MAGICO: Detectar listas desde la URL
  useEffect(() => {
    const xUrl = searchParams.get("x_str")
    const yUrl = searchParams.get("y_str")
    
    if (xUrl && yUrl) {
        setInputs(prev => ({
            ...prev,
            x_str: xUrl,
            y_str: yUrl,
            // Si la IA sugiere un punto a evaluar (x_eval), lo usamos
            x_eval: searchParams.get("x_eval") ? parseFloat(searchParams.get("x_eval")!) : prev.x_eval
        }))
    }
  }, [searchParams])

  // B. FUNCIÓN PARA EL ESCÁNER INTERNO
  const handleAutocompletar = (datosIA: any) => {
    setInputs(prev => ({
        ...prev,
        x_str: datosIA.x_str || prev.x_str,
        y_str: datosIA.y_str || prev.y_str,
        x_eval: datosIA.x_eval !== null ? datosIA.x_eval : prev.x_eval
    }))
  }

  const calcular = async () => {
    setLoading(true)
    try {
      const x_arr = inputs.x_str.split(',').map(num => parseFloat(num.trim())).filter(n => !isNaN(n))
      const y_arr = inputs.y_str.split(',').map(num => parseFloat(num.trim())).filter(n => !isNaN(n))

      if (x_arr.length !== y_arr.length) {
        alert("Error: La cantidad de puntos X e Y debe ser igual")
        setLoading(false)
        return
      }

      const res = await fetch('https://api-modelado.onrender.com/interpolacion/lagrange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            x_puntos: x_arr,
            y_puntos: y_arr,
            x_eval: inputs.x_eval
        })
      })

      if (!res.ok) throw new Error("Error en la respuesta del servidor")
      const data = await res.json()
      
      // Preparar datos para gráfica (Mezcla de Curva y Puntos)
      const datosCurva = data.grafica.x.map((x: number, i: number) => ({
        x: x,
        y_curva: data.grafica.y[i],
        y_punto: null
      }))

      // Validamos que existan los puntos originales en la respuesta
      const pt_x = data.grafica.puntos_x || data.grafica.puntos_originales_x || x_arr
      const pt_y = data.grafica.puntos_y || data.grafica.puntos_originales_y || y_arr

      const datosPuntos = pt_x.map((x: number, i: number) => ({
        x: x,
        y_curva: null, 
        y_punto: pt_y[i]
      }))

      setResultado({
        ...data,
        datosGraficos: [...datosCurva, ...datosPuntos].sort((a, b) => a.x - b.x)
      })

    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error al calcular.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between border-b pb-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                    <Calculator className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Interpolación de Lagrange</h1>
                    <p className="text-slate-500">Encuentra el polinomio único que pasa por tus puntos</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PANEL DE INPUTS */}
          <Card className="md:col-span-4 h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                  <CardTitle>Datos de Entrada</CardTitle>
                  <CardDescription>Separa los valores por comas</CardDescription>
              </div>
              {/* BOTÓN ESCÁNER */}
              <div className="scale-90 origin-right -mt-4">
                  <ProblemScanner onScanComplete={handleAutocompletar} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Puntos X (ej: 0, 1, 3)</Label>
                <Input 
                  value={inputs.x_str}
                  onChange={(e) => setInputs({...inputs, x_str: e.target.value})}
                  placeholder="0, 1, 2" 
                />
              </div>
              <div className="space-y-2">
                <Label>Puntos Y (ej: 1, 2, 0)</Label>
                <Input 
                   value={inputs.y_str}
                   onChange={(e) => setInputs({...inputs, y_str: e.target.value})}
                   placeholder="5, 3, 8" 
                />
              </div>
              
              <div className="pt-4 border-t">
                <Label>Evaluar en X (Opcional)</Label>
                <div className="flex gap-2 mt-1">
                    <Input 
                        type="number" 
                        value={inputs.x_eval}
                        onChange={(e) => setInputs({...inputs, x_eval: parseFloat(e.target.value)})}
                    />
                    <Button onClick={calcular} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "..." : <ArrowRight className="w-4 h-4" />}
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RESULTADOS */}
          <div className="md:col-span-8 space-y-6">
            
            <Card>
                <CardHeader>
                    <CardTitle>Polinomio Resultante</CardTitle>
                </CardHeader>
                <CardContent>
                    {resultado ? (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg font-mono text-sm break-all text-blue-800">
                            P(x) = {resultado.ecuacion_texto}
                        </div>
                    ) : (
                        <div className="text-slate-400 italic">Calcula para ver la ecuación</div>
                    )}
                    
                    {resultado && resultado.evaluacion && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="font-bold text-slate-700">Resultado:</span>
                            <span className="text-xl font-bold text-slate-900">P({resultado.evaluacion.x_solicitada}) = {resultado.evaluacion.y_resultado.toFixed(6)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="h-[350px] pt-6">
                    {resultado ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={resultado.datosGraficos}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} />
                                <YAxis />
                                <Tooltip />
                                <Line 
                                    dataKey="y_curva" 
                                    stroke="#2563eb" 
                                    dot={false} 
                                    strokeWidth={2}
                                    type="monotone"
                                    name="Polinomio"
                                />
                                <Scatter 
                                    dataKey="y_punto" 
                                    fill="#dc2626" 
                                    name="Datos Originales"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-lg">
                            Gráfica del Polinomio
                        </div>
                    )}
                </CardContent>
            </Card>
            
             {/* PASOS */}
             {resultado && (
              <Card>
                <CardHeader><CardTitle>Procedimiento</CardTitle></CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-md h-[200px] overflow-y-auto font-mono text-xs space-y-2 border border-slate-200">
                    {resultado.pasos.map((paso: string, index: number) => (
                      <div key={index} className="pb-2 border-b last:border-0 border-slate-200 text-slate-700">
                        {paso}
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
export default function LagrangePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-blue-600">Cargando Laboratorio...</div>}>
      <LagrangeContent />
    </Suspense>
  )
}