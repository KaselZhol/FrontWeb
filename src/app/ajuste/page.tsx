"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from "lucide-react"

// Importamos el Escáner Híbrido
import ProblemScanner from "@/components/ProblemScanner"

// 1. COMPONENTE INTERNO (Lógica)
function AjusteContent() {
  const searchParams = useSearchParams()

  const [inputs, setInputs] = useState({
    x_str: "1, 2, 3, 4, 5",
    y_str: "0.5, 2.5, 2.0, 4.0, 3.5",
    grado: 1,
    x_eval: 6
  })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // A. EFECTO MAGICO: Detectar datos de la IA desde la URL
  useEffect(() => {
    // Si la URL tiene datos de listas (x_str, y_str), los cargamos
    const xUrl = searchParams.get("x_str")
    const yUrl = searchParams.get("y_str")
    
    if (xUrl && yUrl) {
        setInputs(prev => ({
            ...prev,
            x_str: xUrl, // La IA ya los manda separados por comas
            y_str: yUrl,
            // Si la IA detectó un grado o punto a evaluar, lo usamos
            grado: searchParams.get("n") ? parseInt(searchParams.get("n")!) : prev.grado,
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
        grado: datosIA.n !== null ? datosIA.n : prev.grado,
        x_eval: datosIA.x_eval !== null ? datosIA.x_eval : prev.x_eval
    }))
  }

  const calcular = async () => {
    setLoading(true)
    try {
      const x_arr = inputs.x_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      const y_arr = inputs.y_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      
      const res = await fetch('https://api-modelado.onrender.com/ajuste/minimos-cuadrados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            x_puntos: x_arr, 
            y_puntos: y_arr, 
            grado: inputs.grado, 
            x_eval: inputs.x_eval 
        })
      })
      const data = await res.json()

      // Combinar datos para gráfica
      const datosGrafica = data.grafica.x_modelo.map((x: number, i: number) => ({
        x: x,
        y_modelo: data.grafica.y_modelo[i],
        y_real: null
      }))
      
      data.grafica.x_datos.forEach((x: number, i: number) => {
        datosGrafica.push({ x: x, y_modelo: null, y_real: data.grafica.y_datos[i] })
      })
      
      setResultado({ ...data, datosGrafica: datosGrafica.sort((a:any, b:any) => a.x - b.x) })
    } catch (e) { alert("Error al calcular") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center space-x-4 border-b pb-6">
            <div className="p-3 bg-orange-600 rounded-lg shadow"><TrendingUp className="text-white"/></div>
            <h1 className="text-3xl font-bold text-slate-900">Ajuste de Curvas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* PANEL DE CONTROL */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Datos Experimentales</CardTitle>
                    {/* BOTÓN ESCÁNER */}
                    <div className="scale-90 origin-right">
                        <ProblemScanner onScanComplete={handleAutocompletar} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                    <div>
                        <Label>X (separado por comas)</Label>
                        <Input value={inputs.x_str} onChange={e => setInputs({...inputs, x_str: e.target.value})} placeholder="1, 2, 3..." />
                    </div>
                    <div>
                        <Label>Y (separado por comas)</Label>
                        <Input value={inputs.y_str} onChange={e => setInputs({...inputs, y_str: e.target.value})} placeholder="2.5, 3.1, 4.0..." />
                    </div>
                    <div>
                        <Label>Grado del Modelo</Label>
                        <Select value={String(inputs.grado)} onValueChange={v => setInputs({...inputs, grado: parseInt(v)})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Lineal (Recta)</SelectItem>
                                <SelectItem value="2">Cuadrático (Parábola)</SelectItem>
                                <SelectItem value="3">Cúbico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Pronosticar en X</Label>
                        <Input type="number" value={inputs.x_eval} onChange={e => setInputs({...inputs, x_eval: parseFloat(e.target.value)})}/>
                    </div>
                    <Button onClick={calcular} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        {loading ? "Ajustando..." : "Calcular Regresión"}
                    </Button>
                </CardContent>
            </Card>

            {/* RESULTADOS */}
            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Regresión Visual</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        {resultado ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={resultado.datosGrafica}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" type="number" domain={['auto', 'auto']}/>
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="y_modelo" stroke="#ea580c" dot={false} strokeWidth={3} name="Modelo Ajustado"/>
                                    <Scatter dataKey="y_real" fill="#1e293b" name="Datos Reales" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-lg">Gráfica de Dispersión</div>}
                    </CardContent>
                </Card>
                
                {resultado && (
                    <Card className="bg-slate-900 text-white">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-3 gap-4 text-sm text-slate-400 text-center border-t border-slate-800 pt-4">
                                <div>
                                    <div className="font-bold text-white text-lg">{resultado.metricas.r2.toFixed(4)}</div>
                                    <div>R² (Calidad)</div>
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">{resultado.metricas.ecm.toFixed(4)}</div>
                                    <div>Error Cuadrático</div>
                                </div>
                                
                                <div>
                                    {/* VALIDACIÓN DE SEGURIDAD PARA PREDICCIÓN */}
                                    {resultado.prediccion ? (
                                        <>
                                            <div className="font-bold text-white text-lg">{resultado.prediccion.y_predicha.toFixed(4)}</div>
                                            <div>Predicción en X={resultado.prediccion.x_solicitada}</div>
                                        </>
                                    ) : (
                                        <div className="text-slate-600 italic mt-2">Sin predicción</div>
                                    )}
                                </div>
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
export default function AjustePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-orange-600">Cargando Laboratorio...</div>}>
      <AjusteContent />
    </Suspense>
  )
}