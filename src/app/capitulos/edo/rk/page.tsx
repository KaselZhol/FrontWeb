"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, Crosshair, Layers } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function RungeKuttaTeoriaPage() {
  
  // Código Python para RK4
  const pythonCode = `def rk4(f, t0, y0, h, n_pasos):
    """
    Resuelve EDOs usando Runge-Kutta de Orden 4.
    El estándar de oro en simulación numérica.
    """
    t = t0
    y = y0
    resultados = [(t, y)]
    
    for _ in range(n_pasos):
        # Calculamos las 4 pendientes
        k1 = f(t, y)
        k2 = f(t + h/2, y + (h/2)*k1)
        k3 = f(t + h/2, y + (h/2)*k2)
        k4 = f(t + h, y + h*k3)
        
        # Promedio ponderado (los del medio valen doble)
        pendiente_promedio = (k1 + 2*k2 + 2*k3 + k4) / 6
        
        # Avanzamos
        y = y + h * pendiente_promedio
        t = t + h
        resultados.append((t, y))
        
    return resultados`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER DE NAVEGACIÓN */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/capitulos">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Índice
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/edo/rk4">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Play className="h-4 w-4 mr-2" /> Ir al Simulador RK4
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mb-4 px-3 py-1 text-sm border-indigo-200 border">
            Capítulo 07 • Ecuaciones Diferenciales
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Métodos de Runge-Kutta (RK4)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            Si Euler es caminar a ciegas, RK4 es tener visión de rayos X. Exploramos el terreno en cuatro puntos distintos antes de dar un paso, logrando una precisión quirúrgica.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Crosshair size={24} /></div>
                <h2 className="text-2xl font-bold m-0">¿Por qué Euler no basta?</h2>
              </div>
              
              <p>
                Euler falla porque usa la pendiente del <em>principio</em> del intervalo para todo el trayecto. Si la curva gira a la mitad, Euler sigue recto y se pierde.
              </p>
              
              

              <p>
                Runge-Kutta (RK) dice: "No confiemos en una sola pendiente".
              </p>
              <Card className="bg-indigo-50 border-indigo-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <Layers size={18} />
                    La Estrategia de Exploración (RK4)
                  </h4>
                  <ul className="list-decimal pl-5 space-y-2 text-indigo-900 text-sm">
                    <li><strong>k1:</strong> Mira la pendiente al inicio (como Euler).</li>
                    <li><strong>k2:</strong> Usa k1 para estimar la pendiente a la mitad del paso.</li>
                    <li><strong>k3:</strong> Usa k2 para mejorar la estimación a la mitad.</li>
                    <li><strong>k4:</strong> Usa k3 para estimar la pendiente al final.</li>
                    <li><strong>Promedio:</strong> Combina las 4 para dar el paso perfecto.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Las 4 Pendientes (Ks)</h2>
              </div>
              <p>
                Para avanzar de <InlineMath math="y_n" /> a <InlineMath math="y_{n+1}" /> con un paso <InlineMath math="h" />:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <div className="grid gap-4 text-sm md:text-base">
                    <BlockMath math="k_1 = f(t_n, y_n)" />
                    <BlockMath math="k_2 = f(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_1)" />
                    <BlockMath math="k_3 = f(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_2)" />
                    <BlockMath math="k_4 = f(t_n + h, y_n + h k_3)" />
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-center font-bold text-slate-700 mb-2">Paso Final (Promedio Ponderado):</p>
                    <BlockMath math="y_{n+1} = y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)" />
                </div>
              </div>

              <p className="text-slate-600">
                Observa que <InlineMath math="k_2" /> y <InlineMath math="k_3" /> tienen peso 2 porque representan la pendiente en el centro del intervalo, que suele ser la más representativa.
              </p>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Implementación RK4</h2>
              </div>
              <p className="mb-4">
                Es un poco más código que Euler, pero la ganancia en precisión vale la pena. El error es de orden <InlineMath math="O(h^5)" />.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>rk4_solver.py</span>
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
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calculator size={24} /></div>
                <h2 className="text-2xl font-bold m-0">RK4 en Acción</h2>
              </div>
              
              <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Problema: <InlineMath math="y' = y - t^2 + 1" />, <InlineMath math="y(0) = 0.5" />
                </h3>
                <p className="text-sm text-slate-500 mb-4">Un solo paso con <InlineMath math="h = 0.5" /> (Paso gigante para probar robustez).</p>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Cálculos Intermedios:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <p><strong>k1</strong> (inicio):</p>
                          <p>f(0, 0.5) = 0.5 - 0 + 1 = <strong>1.5</strong></p>
                      </div>
                      <div>
                          <p><strong>k2</strong> (mitad 1):</p>
                          <p>t = 0.25, y = 0.5 + 0.25(1.5) = 0.875</p>
                          <p>f(0.25, 0.875) = <strong>1.8125</strong></p>
                      </div>
                      <div>
                          <p><strong>k3</strong> (mitad 2):</p>
                          <p>t = 0.25, y = 0.5 + 0.25(1.8125) = 0.953</p>
                          <p>f(0.25, 0.953) = <strong>1.8906</strong></p>
                      </div>
                      <div>
                          <p><strong>k4</strong> (final):</p>
                          <p>t = 0.5, y = 0.5 + 0.5(1.8906) = 1.445</p>
                          <p>f(0.5, 1.445) = <strong>2.1953</strong></p>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 mt-2">
                      <p className="font-bold text-indigo-700">Promedio Ponderado:</p>
                      <p>(1.5 + 2(1.8125) + 2(1.8906) + 2.1953) / 6 = <strong>1.8502</strong></p>
                      <p className="mt-2 font-bold text-lg">Resultado Final:</p>
                      <p>y(0.5) = 0.5 + 0.5 * 1.8502 = <strong>1.4251</strong></p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/edo/rk4">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Verificar en Simulador <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: RECURSOS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Aprender Más</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/M%C3%A9todo_de_Runge-Kutta" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Familia completa de métodos RK.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=runge+kutta+4+method" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Explicación visual del promedio.</p>
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
                    <li><a href="#concepto" className="text-slate-500 hover:text-indigo-600 hover:border-l-2 border-indigo-600 -ml-[17px] pl-[15px] block transition-all">¿Por qué RK4?</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-indigo-600 block transition-all">Fórmulas k1-k4</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-indigo-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-indigo-600 block transition-all">Ejemplo Manual</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-indigo-600 block transition-all">Recursos</a></li>
                </ul>
                
                <div className="mt-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">PRECISIÓN MÁXIMA</p>
                    <Link href="/edo/rk4">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 text-xs">Simulador RK4</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}