"use client"
import { useState } from "react"
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from "lucide-react"

export default function AjustePage() {
  const [inputs, setInputs] = useState({ x_str: "1, 2, 3, 4, 5", y_str: "0.5, 2.5, 2.0, 4.0, 3.5", grado: 1, x_eval: 6 })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    setLoading(true)
    try {
      const x_arr = inputs.x_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      const y_arr = inputs.y_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      
      // 👇 URL DE PRODUCCIÓN
      const res = await fetch('https://api-modelado.onrender.com/ajuste/minimos-cuadrados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x_puntos: x_arr, y_puntos: y_arr, grado: inputs.grado, x_eval: inputs.x_eval })
      })
      const data = await res.json()

      // Combinar datos para gráfica (Puntos originales + Línea de modelo)
      const datosGrafica = data.grafica.x_modelo.map((x: number, i: number) => ({
        x: x,
        y_modelo: data.grafica.y_modelo[i],
        y_real: null
      }))
      // Agregamos puntos reales al array
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
        <div className="flex items-center space-x-4 border-b pb-6">
            <div className="p-3 bg-orange-600 rounded-lg shadow"><TrendingUp className="text-white"/></div>
            <h1 className="text-3xl font-bold text-slate-900">Ajuste de Curvas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader><CardTitle>Datos Experimentales</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div><Label>X (separado por comas)</Label><Input value={inputs.x_str} onChange={e => setInputs({...inputs, x_str: e.target.value})} /></div>
                    <div><Label>Y (separado por comas)</Label><Input value={inputs.y_str} onChange={e => setInputs({...inputs, y_str: e.target.value})} /></div>
                    <div>
                        <Label>Grado del Modelo</Label>
                        <Select onValueChange={v => setInputs({...inputs, grado: parseInt(v)})} defaultValue="1">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Lineal (Recta)</SelectItem>
                                <SelectItem value="2">Cuadrático (Parábola)</SelectItem>
                                <SelectItem value="3">Cúbico</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Pronosticar en X</Label><Input type="number" value={inputs.x_eval} onChange={e => setInputs({...inputs, x_eval: parseFloat(e.target.value)})}/></div>
                    <Button onClick={calcular} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
                        {loading ? "Ajustando..." : "Calcular Regresión"}
                    </Button>
                </CardContent>
            </Card>

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
                        ) : <div className="h-full flex items-center justify-center text-slate-300">Gráfica de Dispersión</div>}
                    </CardContent>
                </Card>
                {resultado && (
                    <Card className="bg-slate-900 text-white">
                        <CardContent className="pt-6">
                            <div className="text-xl font-mono mb-4 text-center text-orange-400">{resultado.ecuacion_texto}</div>
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
                                    <div className="font-bold text-white text-lg">{resultado.prediccion.y_predicha.toFixed(4)}</div>
                                    <div>Predicción en X={resultado.prediccion.x_solicitada}</div>
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