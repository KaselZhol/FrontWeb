"use client"

import { useState } from "react"
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

export default function LagrangePage() {
  // Estado para los inputs de texto (String)
  const [inputs, setInputs] = useState({
    x_str: "0, 1, 3",
    y_str: "1, 2, 0",
    x_eval: 2.0
  })

  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    setLoading(true)
    try {
      // 1. Convertir texto a Array
      const x_arr = inputs.x_str.split(',').map(num => parseFloat(num.trim())).filter(n => !isNaN(n))
      const y_arr = inputs.y_str.split(',').map(num => parseFloat(num.trim())).filter(n => !isNaN(n))

      if (x_arr.length !== y_arr.length) {
        alert("Error: La cantidad de puntos X e Y debe ser igual")
        setLoading(false)
        return
      }

      // 2. Llamar API
      const res = await fetch('https://srv-d4qfe1re5dus73emp6eg.onrender.com/interpolacion/lagrange', {
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
      
      // --- DEBUG: ESTO TE SALVARÁ LA VIDA ---
      console.log("Datos recibidos de Python:", data) 
      // Abre la consola (F12) para ver esto si vuelve a fallar

      // 3. Preparar datos para gráfica
      // CORRECCIÓN: Usamos 'grafica' y 'puntos_x' / 'puntos_y' según tu Python
      
      const datosCurva = data.grafica.x.map((x: number, i: number) => ({
        x: x,
        y_curva: data.grafica.y[i],
        y_punto: null
      }))

      // AQUÍ ESTABA EL ERROR: Usamos || [] por si viene vacío y corregimos el nombre de la llave
      const pt_x = data.grafica.puntos_x || data.grafica.puntos_originales_x || []
      const pt_y = data.grafica.puntos_y || data.grafica.puntos_originales_y || []

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
      // AHORA EL ERROR SERÁ VISIBLE EN LA CONSOLA
      console.error("Detalle del error:", error)
      alert("Ocurrió un error (Mira la consola F12 para detalles)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center space-x-4 border-b pb-6">
          <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Interpolación de Lagrange</h1>
            <p className="text-slate-500">Encuentra el polinomio único que pasa por tus puntos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* PANEL DE INPUTS */}
          <Card className="md:col-span-4 h-fit">
            <CardHeader>
              <CardTitle>Datos de Entrada</CardTitle>
              <CardDescription>Separa los valores por comas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                        <ArrowRight className="w-4 h-4" />
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
                        <div className="p-4 bg-slate-100 rounded-lg font-mono text-sm break-all text-blue-800">
                            P(x) = {resultado.ecuacion_texto}
                        </div>
                    ) : (
                        <div className="text-slate-400 italic">Calcula para ver la ecuación</div>
                    )}
                    
                    {resultado && resultado.evaluacion && (
                        <div className="mt-4 flex items-center gap-2">
                            <span className="font-bold text-slate-700">Resultado:</span>
                            <span className="text-xl font-bold">P({resultado.evaluacion.x_solicitada}) = {resultado.evaluacion.y_resultado.toFixed(6)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardContent className="h-[350px] pt-6">
                    {resultado ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {/* ComposedChart permite mezclar Lineas y Puntos */}
                            <ComposedChart data={resultado.datosGraficos}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="x" type="number" domain={['auto', 'auto']} />
                                <YAxis />
                                <Tooltip />
                                {/* La Curva Azul */}
                                <Line 
                                    dataKey="y_curva" 
                                    stroke="#2563eb" 
                                    dot={false} 
                                    strokeWidth={2}
                                    type="monotone"
                                    name="Polinomio"
                                />
                                {/* Los Puntos Rojos Originales */}
                                <Scatter 
                                    dataKey="y_punto" 
                                    fill="#dc2626" 
                                    name="Datos Originales"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-300">
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
                  <div className="bg-slate-50 p-4 rounded-md h-[200px] overflow-y-auto font-mono text-xs space-y-2">
                    {resultado.pasos.map((paso: string, index: number) => (
                      <div key={index} className="pb-2 border-b last:border-0 border-slate-200">
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