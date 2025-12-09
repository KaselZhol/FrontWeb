"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, Sigma, Info } from "lucide-react"

// Librerías para Fórmulas
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function SimpsonTeoriaPage() {
  
  const pythonCode = `def simpson_1_3(f, a, b, n):
    """
    Regla de Simpson 1/3.
    IMPORTANTE: 'n' debe ser un número PAR de segmentos.
    """
    if n % 2 != 0:
        raise ValueError("Simpson requiere n par")
        
    h = (b - a) / n
    suma = f(a) + f(b)
    
    # Términos impares (se multiplican por 4)
    for i in range(1, n, 2):
        suma += 4 * f(a + i * h)
        
    # Términos pares (se multiplican por 2)
    for i in range(2, n-1, 2):
        suma += 2 * f(a + i * h)
        
    resultado = (h / 3) * suma
    return resultado`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/capitulos">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Índice
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/integracion">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200">
                    <Play className="h-4 w-4 mr-2" /> Ir al Simulador
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 mb-4 px-3 py-1 text-sm border-emerald-200 border">
            Capítulo 05 • Integración Numérica
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Regla de Simpson 1/3
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            Si el Trapecio usa líneas rectas, Simpson usa <strong>Parábolas</strong>. 
            Al ajustar curvas de segundo grado a los datos, logramos una precisión increíblemente alta con muy pocos cálculos.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Lightbulb size={24} /></div>
                <h2 className="text-2xl font-bold m-0">El Poder de las Parábolas</h2>
              </div>
              <p>
                La mayoría de las funciones en ingeniería son suaves y curvas, no angulares como un trapecio. 
                Simpson conecta cada 3 puntos con una parábola (<InlineMath math="ax^2+bx+c" />), lo que se adapta mejor a la forma real de la función.
              </p>
              
              <Card className="bg-amber-50 border-amber-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Info size={18} />
                    Requisito Importante
                  </h4>
                  <p className="text-amber-800 text-sm">
                    Para usar Simpson 1/3, necesitas un número <strong>PAR</strong> de segmentos (n = 2, 4, 6...). 
                    Esto se debe a que cada parábola necesita 3 puntos (2 segmentos) para definirse.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">La Fórmula de Simpson 1/3</h2>
              </div>
              <p>
                La magia está en los coeficientes. En lugar de sumar todo por 2 (como en Trapecio), alternamos pesos:
                Los extremos valen 1, los impares valen 4 y los pares valen 2.
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-center">
                <BlockMath math="I \approx \frac{h}{3} \left[ f(x_0) + 4 \sum_{i=1,3,5}^{n-1} f(x_i) + 2 \sum_{i=2,4,6}^{n-2} f(x_i) + f(x_n) \right]" />
              </div>

              <p className="text-slate-600">
                El patrón es: <strong>1 - 4 - 2 - 4 - ... - 2 - 4 - 1</strong>.
              </p>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Implementación en Python</h2>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>algoritmo_simpson.py</span>
                  <span>Python 3.9+</span>
                </div>
                <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{margin: 0, padding: '1.5rem'}}>
                  {pythonCode}
                </SyntaxHighlighter>
              </div>
            </section>

            {/* SECCIÓN 4: EJEMPLO */}
            <section id="ejemplo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calculator size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Comparación Trapecio vs Simpson</h2>
              </div>
              
              <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Integral de <InlineMath math="e^x" /> de 0 a 2 (n=2)
                </h3>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  <p><strong>Valor Real:</strong> e² - e⁰ = 6.389056...</p>
                  <p>h = (2-0)/2 = 1.0</p>
                  <ul className="pl-8 list-disc">
                     <li>f(0) = 1</li>
                     <li>f(1) = 2.71828</li>
                     <li>f(2) = 7.38905</li>
                  </ul>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-3 bg-red-50 border border-red-100 rounded">
                          <p className="font-bold text-red-700">Trapecio:</p>
                          <p>(1/2) * [1 + 2(2.718) + 7.389]</p>
                          <p>= 6.912 <span className="text-red-600">(Error: ~8%)</span></p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-100 rounded">
                          <p className="font-bold text-green-700">Simpson 1/3:</p>
                          <p>(1/3) * [1 + 4(2.718) + 7.389]</p>
                          <p>= 6.420 <span className="text-green-600">(Error: ~0.4%)</span></p>
                      </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/integracion">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Probar Diferencia en Simulador <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: RECURSOS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Aprender Más</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/Regla_de_Simpson" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-emerald-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Regla de Simpson 3/8 también.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=simpson+1%2F3+integration" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Ejercicios paso a paso.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                </div>
             </section>

          </article>

          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
                <h5 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contenido</h5>
                <ul className="space-y-3 text-sm border-l border-slate-200 pl-4">
                    <li><a href="#concepto" className="text-slate-500 hover:text-emerald-600 hover:border-l-2 border-emerald-600 -ml-[17px] pl-[15px] block transition-all">Parábolas vs Rectas</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-emerald-600 block transition-all">Fórmula 1/3</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-emerald-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-emerald-600 block transition-all">Trapecio vs Simpson</a></li>
                </ul>
                
                <div className="mt-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-semibold mb-2">INTEGRACIÓN IA</p>
                    <Link href="/integracion">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-8 text-xs">Simulador Integral</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}