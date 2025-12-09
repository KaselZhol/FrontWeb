"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, History, GitBranch } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function NewtonTeoriaPage() {
  
  // Código Python para Newton
  const pythonCode = `def interpolacion_newton(x_puntos, y_puntos, x_eval):
    """
    Calcula el polinomio usando Diferencias Divididas de Newton.
    Ideal para agregar puntos progresivamente.
    """
    n = len(x_puntos)
    # Tabla de diferencias divididas
    tabla = [[0] * n for _ in range(n)]
    
    # Llenamos la primera columna con las Y
    for i in range(n):
        tabla[i][0] = y_puntos[i]
    
    # Calculamos las diferencias divididas
    for j in range(1, n):
        for i in range(n - j):
            numerador = tabla[i+1][j-1] - tabla[i][j-1]
            denominador = x_puntos[i+j] - x_puntos[i]
            tabla[i][j] = numerador / denominador
            
    # Construimos el polinomio evaluado
    resultado = tabla[0][0]
    producto_x = 1.0
    
    for i in range(1, n):
        producto_x *= (x_eval - x_puntos[i-1])
        resultado += tabla[0][i] * producto_x
        
    return resultado`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900">
      
      {/* HEADER DE NAVEGACIÓN */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/capitulos">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Índice
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/interpolacion/newton">
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-200">
                    <Play className="h-4 w-4 mr-2" /> Simulador Newton
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-purple-50 text-purple-700 hover:bg-purple-100 mb-4 px-3 py-1 text-sm border-purple-200 border">
            Capítulo 01 • Parte 2
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Interpolación de Newton
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            Conocido como el método de las <strong>Diferencias Divididas</strong>. A diferencia de Lagrange, este método es modular: nos permite añadir nuevos puntos de datos sin tener que recalcular todo desde cero.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: HISTORIA Y CONTEXTO */}
            <section id="historia" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><History size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Historia y Origen</h2>
              </div>
              <p>
                Isaac Newton publicó este método en su obra <em>Methodus Differentialis</em> en 1711. Newton buscaba una forma más eficiente de calcular posiciones de cuerpos celestes (astronomía) cuando se obtenían nuevas observaciones noche tras noche.
              </p>
              <Card className="bg-purple-50 border-purple-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <GitBranch size={18} />
                    ¿Lagrange vs Newton?
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    <li><strong>Lagrange:</strong> Es más fácil de programar teóricamente, pero si agregas un punto, debes rehacer todo.</li>
                    <li><strong>Newton:</strong> Es computacionalmente más eficiente para datos dinámicos. Si tienes 4 puntos y llega el 5º, solo calculas una nueva diferencia dividida.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Las Diferencias Divididas</h2>
              </div>
              <p>
                La forma general del polinomio de Newton es una suma escalonada:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <BlockMath math="P_n(x) = b_0 + b_1(x-x_0) + b_2(x-x_0)(x-x_1) + \dots" />
              </div>

              <p className="text-slate-600 mb-4">
                ¿De dónde salen esos coeficientes <InlineMath math="b_i" />? Se calculan usando una tabla triangular llamada <strong>Tabla de Diferencias Divididas</strong>:
              </p>
              
              <div className="my-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                <BlockMath math="b_0 = f(x_0)" />
                <BlockMath math="b_1 = \frac{f(x_1) - f(x_0)}{x_1 - x_0}" />
                <BlockMath math="b_2 = \frac{\frac{f(x_2)-f(x_1)}{x_2-x_1} - b_1}{x_2 - x_0}" />
              </div>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Código Python</h2>
              </div>
              <p className="mb-4">
                Esta implementación utiliza una matriz para almacenar la tabla de diferencias divididas. Es la misma lógica que usa tu simulador web.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>newton_method.py</span>
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
              
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Datos: (1, 0), (4, 1.38), (6, 1.79)</h3>
                <p className="mb-4 text-slate-600 text-sm">Queremos interpolar <InlineMath math="ln(2)" /> (aprox).</p>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700 overflow-x-auto">
                  <p><strong>b0:</strong> 0</p>
                  <p><strong>b1:</strong> (1.38 - 0) / (4 - 1) = <strong>0.46</strong></p>
                  <p><strong>b2:</strong> ((1.79-1.38)/(6-4) - 0.46) / (6 - 1)</p>
                  <p className="pl-8">= (0.205 - 0.46) / 5 = <strong>-0.051</strong></p>
                  
                  <p className="mt-4 border-t border-slate-200 pt-2 font-bold text-orange-700">
                    Polinomio: P(x) = 0 + 0.46(x-1) - 0.051(x-1)(x-4)
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/interpolacion/newton">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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
                    <a href="https://es.wikipedia.org/wiki/Interpolaci%C3%B3n_polin%C3%B3mica_de_Newton" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-purple-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Teoría profunda.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=diferencias+divididas+newton" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Ejercicios resueltos en video.</p>
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
                    <li><a href="#historia" className="text-slate-500 hover:text-purple-600 hover:border-l-2 border-purple-600 -ml-[17px] pl-[15px] block transition-all">Historia y Origen</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-purple-600 block transition-all">Diferencias Divididas</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-purple-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-purple-600 block transition-all">Ejemplo Manual</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-purple-600 block transition-all">Recursos</a></li>
                </ul>
                
                <div className="mt-8 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-semibold mb-2">HERRAMIENTA</p>
                    <p className="text-xs text-purple-500 mb-4">Calcula la tabla de diferencias automáticamente.</p>
                    <Link href="/interpolacion/newton">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs">Simulador Newton</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}