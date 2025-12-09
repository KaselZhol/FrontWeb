"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, TrendingUp, AlertTriangle } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function AjusteTeoriaPage() {
  
  // Código Python para Regresión Lineal Simple
  const pythonCode = `def regresion_lineal(x_puntos, y_puntos):
    """
    Calcula la pendiente (m) y la intersección (b) 
    de la recta que mejor se ajusta: y = mx + b
    """
    n = len(x_puntos)
    
    # Calculamos las sumatorias necesarias
    sum_x = sum(x_puntos)
    sum_y = sum(y_puntos)
    sum_xy = sum(x*y for x, y in zip(x_puntos, y_puntos))
    sum_x2 = sum(x**2 for x in x_puntos)
    
    # Fórmulas de Mínimos Cuadrados
    numerador_m = (n * sum_xy) - (sum_x * sum_y)
    denominador_m = (n * sum_x2) - (sum_x ** 2)
    
    m = numerador_m / denominador_m
    b = (sum_y - (m * sum_x)) / n
    
    return m, b
    
# Ejemplo de uso:
# m, b = regresion_lineal([1, 2, 3], [2, 4, 5])
# y_pred = m * 4 + b`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      
      {/* HEADER DE NAVEGACIÓN */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/capitulos">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Índice
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/ajuste">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200">
                    <Play className="h-4 w-4 mr-2" /> Simulador de Ajuste
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 mb-4 px-3 py-1 text-sm border-orange-200 border">
            Capítulo 03 • Modelado de Datos
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Ajuste de Curvas (Mínimos Cuadrados)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            A diferencia de la interpolación, aquí no queremos unir los puntos. Queremos encontrar la <strong>tendencia general</strong> que minimice el error en datos ruidosos o experimentales.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Lightbulb size={24} /></div>
                <h2 className="text-2xl font-bold m-0">¿La línea perfecta?</h2>
              </div>
              <p>
                Imagina que lanzas una pelota y mides su altura en diferentes momentos. Tu reloj no es perfecto y tu regla tampoco, por lo que los datos tienen "ruido" (pequeños errores).
              </p>
              <p>
                Si usaras interpolación, la curva zigzaguearía locamente para tocar cada punto erróneo. 
                Con el <strong>Ajuste de Curvas</strong>, buscamos una línea suave que pase <em>cerca</em> de todos los puntos, ignorando el ruido individual.
              </p>

              <Card className="bg-amber-50 border-amber-100 my-6">
                <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20}/>
                        <div>
                            <h4 className="font-semibold text-amber-900 mb-1">Diferencia Clave:</h4>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                <strong>Interpolación:</strong> La curva pasa EXACTAMENTE por los puntos.<br/>
                                <strong>Ajuste (Regresión):</strong> La curva pasa CERCA de los puntos (minimiza el error global).
                            </p>
                        </div>
                    </div>
                </CardContent>
              </Card>
              
              

[Image of Linear regression scatter plot with residuals]


            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">El Método de Mínimos Cuadrados</h2>
              </div>
              <p>
                Buscamos una recta <InlineMath math="y = mx + b" />. El "error" en cada punto es la distancia vertical entre el punto real y la recta:
              </p>
              <div className="text-center my-4">
                 <InlineMath math="Error_i = y_i - (mx_i + b)" />
              </div>
              <p>
                Para eliminar signos negativos, elevamos el error al cuadrado. El objetivo es minimizar la suma total de estos errores cuadrados:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-center">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Función de Costo</h3>
                <BlockMath math="S_r = \sum_{i=1}^{n} (y_i - mx_i - b)^2" />
              </div>

              <p className="text-slate-600 mb-4">
                Usando cálculo diferencial (derivadas parciales igualadas a cero), obtenemos las fórmulas directas para <InlineMath math="m" /> y <InlineMath math="b" />:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-center font-semibold mb-2 text-slate-700">Pendiente (m)</p>
                    <BlockMath math="m = \frac{n \sum xy - \sum x \sum y}{n \sum x^2 - (\sum x)^2}" />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-center font-semibold mb-2 text-slate-700">Intersección (b)</p>
                    <BlockMath math="b = \bar{y} - m\bar{x}" />
                  </div>
              </div>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Código Python (Sin librerías)</h2>
              </div>
              <p className="mb-4">
                Aunque librerías como <code>scikit-learn</code> o <code>numpy</code> lo hacen automático, así es como se programa la matemática pura desde cero:
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>regresion_simple.py</span>
                  <span>Python 3.9+</span>
                </div>
                <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{margin: 0, padding: '1.5rem'}}>
                  {pythonCode}
                </SyntaxHighlighter>
              </div>
            </section>

            {/* SECCIÓN 4: EJEMPLO PRÁCTICO */}
            <section id="ejemplo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Calculator size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Ejemplo: Horas de Estudio vs Notas</h2>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Datos Recolectados:</h3>
                        <table className="w-full text-sm text-left mb-4">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr><th className="p-2">Estudiante</th><th className="p-2">Horas (x)</th><th className="p-2">Nota (y)</th></tr>
                            </thead>
                            <tbody>
                                <tr className="border-b"><td className="p-2">1</td><td className="p-2">1</td><td className="p-2">2</td></tr>
                                <tr className="border-b"><td className="p-2">2</td><td className="p-2">2</td><td className="p-2">4</td></tr>
                                <tr className="border-b"><td className="p-2">3</td><td className="p-2">3</td><td className="p-2">5</td></tr>
                                <tr><td className="p-2">4</td><td className="p-2">4</td><td className="p-2">4</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="space-y-2 text-sm font-mono bg-slate-50 p-4 rounded-lg">
                        <p className="text-slate-500">Cálculos intermedios:</p>
                        <p>n = 4</p>
                        <p>Σx = 10, Σy = 15</p>
                        <p>Σxy = 2+8+15+16 = 41</p>
                        <p>Σx² = 1+4+9+16 = 30</p>
                        <div className="h-px bg-slate-200 my-2"></div>
                        <p className="font-bold text-orange-600">m = (4*41 - 10*15) / (4*30 - 100)</p>
                        <p className="font-bold text-orange-600">m = 14 / 20 = 0.7</p>
                        <p>b = (15 - 0.7*10)/4 = 2.0</p>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg text-center">
                    <p className="text-lg font-bold text-orange-800 mb-2">Modelo Final: y = 0.7x + 2.0</p>
                    <p className="text-sm text-orange-700">
                        Predicción: Si estudias <strong>5 horas</strong>, tu nota esperada es <InlineMath math="0.7(5) + 2 = 5.5" />
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/ajuste">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                            Ir al Simulador de Ajuste <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: RECURSOS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Aprender Más</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/M%C3%ADnimos_cuadrados" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-orange-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Derivación matemática completa.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=minimos+cuadrados+regresion" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Ejemplos visuales y ejercicios.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                </div>
             </section>

          </article>

          {/* SIDEBAR DE NAVEGACIÓN */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
                <h5 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contenido</h5>
                <ul className="space-y-3 text-sm border-l border-slate-200 pl-4">
                    <li><a href="#concepto" className="text-slate-500 hover:text-orange-600 hover:border-l-2 border-orange-600 -ml-[17px] pl-[15px] block transition-all">Concepto: Ruido vs Señal</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-orange-600 block transition-all">Mínimos Cuadrados</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-orange-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-orange-600 block transition-all">Ejemplo: Notas</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-orange-600 block transition-all">Recursos</a></li>
                </ul>
                
                <div className="mt-8 bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-xs text-orange-600 font-semibold mb-2">HERRAMIENTA IA</p>
                    <p className="text-xs text-orange-500 mb-4">Calcula la regresión, R² y error cuadrático al instante.</p>
                    <Link href="/ajuste">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700 h-8 text-xs">Simulador de Ajuste</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}