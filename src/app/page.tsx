"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Activity, Play, RefreshCw } from "lucide-react"

export default function Home() {
  // 1. ESTADO: Aquí guardamos los datos del formulario
  const [params, setParams] = useState({
    ecuacion: "y - t**2 + 1",
    t0: 0,
    y0: 0.5,
    h: 0.1,
    pasos: 10
  })

  // 2. ESTADO: Aquí guardamos la respuesta de Python
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 3. LÓGICA: Función que llama a tu API (FastAPI)
  const calcularModelo = async () => {
    setLoading(true)
    try {
      // NOTA: Asegúrate de que esta URL coincida con tu backend
      const res = await fetch('http://127.0.0.1:8000/edo/rk4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      
      if (!res.ok) throw new Error("Error en la petición al servidor")

      const data = await res.json()
      
      // Transformamos los datos para que la gráfica de Recharts los entienda
      const datosGrafica = data.grafica.t.map((t: number, i: number) => ({
        tiempo: t.toFixed(2),
        valor: data.grafica.y[i]
      }))

      setResultado({ ...data, datosGrafica })
    } catch (error) {
      alert("Error: No se pudo conectar con el Backend. ¿Está encendido el servidor Python?")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER: Título estilo Dashboard */}
        <div className="flex items-center space-x-4 border-b pb-6 border-slate-200">
          <div className="p-3 bg-slate-900 rounded-lg shadow-lg">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laboratorio Numérico</h1>
            <p className="text-slate-500 font-medium">Simulación de Ecuaciones Diferenciales (Método RK4)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: Formulario de Entrada */}
          <Card className="lg:col-span-4 shadow-sm border-slate-200">
            <CardHeader className="bg-slate-100/50">
              <CardTitle>Configuración</CardTitle>
              <CardDescription>Parámetros iniciales del problema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label className="text-slate-600">Ecuación Diferencial (y')</Label>
                <Input 
                  value={params.ecuacion} 
                  onChange={(e) => setParams({...params, ecuacion: e.target.value})}
                  className="font-mono bg-slate-50"
                  placeholder="ej: y - t**2 + 1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>t0 (Inicio)</Label>
                  <Input type="number" value={params.t0} onChange={(e) => setParams({...params, t0: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>y0 (Inicial)</Label>
                  <Input type="number" value={params.y0} onChange={(e) => setParams({...params, y0: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Paso (h)</Label>
                  <Input type="number" value={params.h} onChange={(e) => setParams({...params, h: parseFloat(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Iteraciones</Label>
                  <Input type="number" value={params.pasos} onChange={(e) => setParams({...params, pasos: parseInt(e.target.value)})} />
                </div>
              </div>

              <Button 
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 transition-all" 
                size="lg"
                onClick={calcularModelo} 
                disabled={loading}
              >
                {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin"/> : <Play className="mr-2 h-4 w-4"/>}
                {loading ? "Calculando..." : "Ejecutar Simulación"}
              </Button>
            </CardContent>
          </Card>

          {/* COLUMNA DERECHA: Resultados Visuales */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. TARJETA DE GRÁFICA */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle>Trayectoria de la Solución</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] p-0 md:p-6 bg-white">
                {resultado ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={resultado.datosGrafica} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="tiempo" 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => value.toFixed(2)}
                      />
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="valor" 
                        stroke="#0f172a" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }} 
                        activeDot={{ r: 7 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <Activity className="h-12 w-12 mb-4 opacity-20" />
                    <p>Ingresa los parámetros y presiona ejecutar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. TARJETA DE RESULTADO NUMÉRICO */}
            {resultado && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-slate-900 text-white border-none shadow-lg">
                  <CardContent className="pt-6">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Valor Final Alcanzado</p>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-4xl font-bold font-mono tracking-tight">
                            {resultado.resultado_final.toFixed(6)}
                        </span>
                        <span className="ml-2 text-slate-500 font-mono">
                            en t={resultado.grafica.t.slice(-1)}
                        </span>
                    </div>
                  </CardContent>
                </Card>

                {/* PASOS EXPLICADOS (Scrollable) */}
                <Card className="border-slate-200 flex flex-col h-[150px]">
                    <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-sm font-medium">Registro de Pasos</CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-y-auto p-4 bg-white font-mono text-xs text-slate-600 space-y-3">
                        {resultado.pasos.map((paso: string, index: number) => (
                        <div key={index} className="pb-2 border-b border-slate-100 last:border-0">
                            {paso}
                        </div>
                        ))}
                    </div>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}