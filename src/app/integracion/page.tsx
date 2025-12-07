"use client"
import { useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sigma } from "lucide-react"

export default function IntegracionPage() {
  const [params, setParams] = useState({
    funcion: "x**2",
    a: 0, b: 10, n: 10, metodo: "trapecio"
  })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    setLoading(true)
    try {
      // 👇 URL DE PRODUCCIÓN
      const url = 'https://api-modelado.onrender.com/integracion/calcular' 
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      const data = await res.json()
      
      // Transformar datos para gráfica de área
      const datosGrafica = data.grafica.x.map((x: number, i: number) => ({
        x: x.toFixed(2),
        y: data.grafica.y[i]
      }))
      
      setResultado({ ...data, datosGrafica })
    } catch (e) { alert("Error al conectar") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 border-b pb-6">
            <div className="p-3 bg-emerald-600 rounded-lg shadow"><Sigma className="text-white"/></div>
            <h1 className="text-3xl font-bold text-slate-900">Cálculo Integral</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader><CardTitle>Parámetros</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Función f(x)</Label>
                        <Input value={params.funcion} onChange={e => setParams({...params, funcion: e.target.value})} placeholder="ej: sin(x) + x"/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label>Desde (a)</Label><Input type="number" value={params.a} onChange={e => setParams({...params, a: parseFloat(e.target.value)})}/></div>
                        <div><Label>Hasta (b)</Label><Input type="number" value={params.b} onChange={e => setParams({...params, b: parseFloat(e.target.value)})}/></div>
                    </div>
                    <div>
                        <Label>Segmentos (N)</Label>
                        <Input type="number" value={params.n} onChange={e => setParams({...params, n: parseInt(e.target.value)})}/>
                    </div>
                    <div>
                        <Label>Método</Label>
                        <Select onValueChange={v => setParams({...params, metodo: v})} defaultValue="trapecio">
                            <SelectTrigger><SelectValue placeholder="Selecciona" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="trapecio">Regla del Trapecio</SelectItem>
                                <SelectItem value="simpson">Simpson 1/3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={calcular} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                         {loading ? "Integrando..." : "Calcular Área"}
                    </Button>
                </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Área Bajo la Curva</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        {resultado ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={resultado.datosGrafica}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="x" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="y" stroke="#059669" fill="#10b981" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-300">Gráfica del Área</div>}
                    </CardContent>
                </Card>
                
                {resultado && (
                    <Card className="bg-slate-900 text-white">
                        <CardContent className="pt-6 text-center">
                            <p className="text-slate-400 uppercase text-xs tracking-widest mb-2">Resultado Aproximado</p>
                            <div className="text-5xl font-mono font-bold">{resultado.resultado.toFixed(6)} <span className="text-xl text-slate-500">u²</span></div>
                            
                            {resultado.error_analisis !== "No calculado" && (
                                <div className="mt-4 p-2 bg-slate-800 rounded inline-block text-sm text-emerald-400 border border-emerald-900">
                                    Error estimado vs real: {typeof resultado.error_analisis === 'number' ? resultado.error_analisis.toExponential(4) : resultado.error_analisis}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}