"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, TrendingUp, Navigation } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function EulerTeoriaPage() {
  
  // Código Python para Euler
  const pythonCode = `def metodo_euler(f, t0, y0, h, n_pasos):
    """
    Resuelve y' = f(t, y) usando el método de Euler.
    t0, y0: Condiciones iniciales
    h: Tamaño del paso
    n_pasos: Número de iteraciones
    """
    t = t0
    y = y0
    resultados = [(t, y)] # Guardamos el inicio
    
    for _ in range(n_pasos):
        # 1. Calculamos la pendiente actual
        pendiente = f(t, y)
        
        # 2. Avanzamos 'h' en la dirección de la pendiente
        y = y + h * pendiente
        t = t + h
        
        resultados.append((t, y))
        
    return resultados

# Ejemplo: y' = t - y, y(0) = 1
# f = lambda t, y: t - y
# sol = metodo_euler(f, 0, 1, 0.1, 10)`

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
            <Link href="/edo/euler">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
                    <Play className="h-4 w-4 mr-2" /> Ir al Simulador
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mb-4 px-3 py-1 text-sm border-indigo-200 border">
            Capítulo 06 • Ecuaciones Diferenciales
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Método de Euler
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            El método más simple y antiguo para simular el futuro. Imagina caminar en la oscuridad usando solo una brújula: miras la dirección actual y das un paso pequeño. Repites.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Navigation size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Navegación por Tangentes</h2>
              </div>
              
              <p>
                Tenemos una ecuación diferencial <InlineMath math="y' = f(t, y)" />. Esto no nos da la posición, nos da la <strong>velocidad</strong> (pendiente) en cualquier punto.
              </p>
              
              

              <p>
                La idea de Leonhard Euler (siglo XVIII) fue simple:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-slate-700">
                  <li>Empiezas en un punto conocido <InlineMath math="(t_0, y_0)" />.</li>
                  <li>Calculas la pendiente ahí.</li>
                  <li>Asumes que la pendiente es constante por un pequeño instante <InlineMath math="h" />.</li>
                  <li>Te mueves a esa nueva posición y repites.</li>
              </ol>

              <Card className="bg-indigo-50 border-indigo-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <TrendingUp size={18} />
                    El Problema del Error
                  </h4>
                  <p className="text-indigo-800 text-sm">
                    Como asumimos que la pendiente es constante durante el paso, nos desviamos de la curva real si esta gira mucho. 
                    <strong>Solución:</strong> Hacer pasos (<InlineMath math="h" />) muy pequeños.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">La Fórmula Iterativa</h2>
              </div>
              <p>
                Usando la serie de Taylor truncada en el primer término (linealización), obtenemos la fórmula recursiva de Euler:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-center">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Algoritmo de Euler</h3>
                <BlockMath math="y_{n+1} = y_n + h \cdot f(t_n, y_n)" />
                <p className="mt-4 text-slate-500">Donde <InlineMath math="t_{n+1} = t_n + h" /></p>
              </div>

              <p className="text-slate-600">
                Es decir: <em>Nuevo Valor = Valor Anterior + (Paso × Pendiente)</em>.
              </p>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Código Python</h2>
              </div>
              <p className="mb-4">
                Es tan simple como un bucle <code>for</code> que actualiza las variables en cada vuelta.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>euler_solver.py</span>
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
                <h2 className="text-2xl font-bold m-0">Ejemplo Manual</h2>
              </div>
              
              <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Problema: <InlineMath math="y' = y" />, con <InlineMath math="y(0) = 1" />
                </h3>
                <p className="text-sm text-slate-500 mb-4">Paso <InlineMath math="h = 0.1" />. (Solución exacta: <InlineMath math="y=e^t" />)</p>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  
                  {/* PASO 0 */}
                  <div className="border-b border-slate-200 pb-2">
                    <p className="font-bold text-indigo-700">Inicio (t=0):</p>
                    <p>y = 1.0</p>
                    <p>Pendiente f(0, 1) = y = 1.0</p>
                  </div>

                  {/* PASO 1 */}
                  <div className="border-b border-slate-200 pb-2">
                    <p className="font-bold text-indigo-700">Paso 1 (t=0.1):</p>
                    <p>y_new = 1.0 + 0.1 * (1.0) = <strong>1.1</strong></p>
                    <p className="text-xs text-slate-400">Real (e^0.1) ≈ 1.105 (Error: 0.005)</p>
                  </div>

                  {/* PASO 2 */}
                  <div>
                    <p className="font-bold text-indigo-700">Paso 2 (t=0.2):</p>
                    <p>Pendiente nueva = y_actual = 1.1</p>
                    <p>y_new = 1.1 + 0.1 * (1.1) = <strong>1.21</strong></p>
                    <p className="text-xs text-slate-400">Real (e^0.2) ≈ 1.221 (Error: 0.011)</p>
                  </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/edo/euler">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Simular más pasos <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: RECURSOS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Aprender Más</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/M%C3%A9todo_de_Euler" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Análisis de estabilidad.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=metodo+euler+edo+explicacion" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Visualización gráfica.</p>
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
                    <li><a href="#concepto" className="text-slate-500 hover:text-indigo-600 hover:border-l-2 border-indigo-600 -ml-[17px] pl-[15px] block transition-all">Concepto Intuitivo</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-indigo-600 block transition-all">Fórmula Recursiva</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-indigo-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-indigo-600 block transition-all">Ejemplo Manual</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-indigo-600 block transition-all">Recursos</a></li>
                </ul>
                
                <div className="mt-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">SIMULADOR EDO</p>
                    <p className="text-xs text-indigo-500 mb-4">Grafica la solución paso a paso.</p>
                    <Link href="/edo/euler">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 text-xs">Simulador Euler</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}