"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calculator, Table as TableIcon } from "lucide-react"

export default function NewtonPage() {
  const [inputs, setInputs] = useState({ x_str: "1, 1.3, 1.6, 1.9, 2.2", y_str: "0.76, 0.62, 0.45, 0.28, 0.11", x_eval: 1.5 })
  const [resultado, setResultado] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const calcular = async () => {
    setLoading(true)
    try {
      const x_arr = inputs.x_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      const y_arr = inputs.y_str.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n))
      
      // 👇 URL DE PRODUCCIÓN
      const res = await fetch('https://api-modelado.onrender.com/interpolacion/newton', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x_puntos: x_arr, y_puntos: y_arr, x_eval: inputs.x_eval })
      })
      const data = await res.json()
      setResultado(data)
    } catch (e) { alert("Error al conectar") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center space-x-4 border-b pb-6">
            <div className="p-3 bg-purple-600 rounded-lg shadow"><Calculator className="text-white"/></div>
            <h1 className="text-3xl font-bold text-slate-900">Interpolación de Newton</h1>
        </div>

        <Card>
            <CardHeader><CardTitle>Datos de Entrada</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>X</Label><Input value={inputs.x_str} onChange={e => setInputs({...inputs, x_str: e.target.value})} /></div>
                    <div><Label>Y</Label><Input value={inputs.y_str} onChange={e => setInputs({...inputs, y_str: e.target.value})} /></div>
                </div>
                <div className="flex gap-4 items-end">
                    <div className="flex-1"><Label>Evaluar en X</Label><Input type="number" value={inputs.x_eval} onChange={e => setInputs({...inputs, x_eval: parseFloat(e.target.value)})}/></div>
                    <Button onClick={calcular} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                        {loading ? "Calculando..." : "Generar Tabla"}
                    </Button>
                </div>
            </CardContent>
        </Card>

        {resultado && (
            <div className="space-y-6">
                {/* RESULTADO FINAL */}
                <Card className="bg-slate-900 text-white border-none shadow-lg">
                    <CardContent className="pt-6">
                         <div className="text-2xl font-mono font-bold mb-2">
                            P({resultado.evaluacion.x}) = {resultado.evaluacion.y.toFixed(6)}
                         </div>
                         <div className="text-xs text-slate-400 font-mono break-all bg-slate-800 p-2 rounded">
                            {resultado.polinomio_texto}
                         </div>
                    </CardContent>
                </Card>

                {/* TABLA DE DIFERENCIAS DIVIDIDAS */}
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2">
                        <TableIcon className="h-5 w-5 text-slate-500"/>
                        <CardTitle>Tabla de Diferencias Divididas</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600">
                            <thead className="bg-slate-100 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-4 py-3">i</th>
                                    <th className="px-4 py-3">xi</th>
                                    <th className="px-4 py-3">f(xi)</th>
                                    {/* Encabezados dinámicos (Orden 1, Orden 2...) */}
                                    {Array.from({length: resultado.coeficientes.length - 1}).map((_, i) => (
                                        <th key={i} className="px-4 py-3 text-purple-700">Orden {i+1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {resultado.puntos_originales_x && resultado.puntos_originales_x.map((x: number, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-2 font-bold text-slate-400">{i}</td>
                                        <td className="px-4 py-2 font-medium">{x}</td>
                                        {/* Matriz Triangular */}
                                        {resultado.tabla_completa[i].map((val: number, j: number) => (
                                            <td key={j} className="px-4 py-2 font-mono">
                                                {val !== 0 ? val.toFixed(5) : <span className="text-slate-200">-</span>}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        )}
      </div>
    </div>
  )
}