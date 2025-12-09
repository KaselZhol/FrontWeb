"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight,BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex' 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter' 
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism' 

export default function InterpolacionTeoriaPage() {
  
  // Código Python que mostraremos
  const pythonCode = `def interpolacion_lagrange(x_puntos, y_puntos, x_eval):
    """
    Calcula el polinomio de Lagrange.
    x_puntos: Lista de coordenadas X conocidas
    y_puntos: Lista de coordenadas Y conocidas
    x_eval: El valor de X donde queremos encontrar Y
    """
    n = len(x_puntos)
    resultado = 0.0

    for i in range(n):
        termino = y_puntos[i]
        for j in range(n):
            if i != j:
                numerador = x_eval - x_puntos[j]
                denominador = x_puntos[i] - x_puntos[j]
                termino = termino * (numerador / denominador)
        resultado += termino
    
    return resultado`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* HEADER DE NAVEGACIÓN */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/capitulos">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-900 -ml-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Índice
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href="/interpolacion/lagrange">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200">
                    <Play className="h-4 w-4 mr-2" /> Ir al Simulador
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-4 px-3 py-1 text-sm border-blue-200 border">
            Capítulo 01 • Métodos Numéricos
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Interpolación de Lagrange
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            ¿Cómo podemos conectar una serie de puntos dispersos con una curva suave perfecta? 
            Lagrange nos ofrece una forma elegante de encontrar un polinomio único que pase por todos ellos.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Lightbulb size={24} /></div>
                <h2 className="text-2xl font-bold m-0">¿Para qué sirve esto?</h2>
              </div>
              <p>
                Imagina que tienes datos de un experimento (tiempo vs temperatura) pero te faltan mediciones intermedias. 
                La interpolación te permite <strong>"rellenar los huecos"</strong>.
              </p>
              <Card className="bg-slate-50 border-none my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-900 mb-2">Aplicaciones Reales:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-600">
                    <li><strong>Gráficos por Computadora:</strong> Para suavizar curvas en diseños 3D.</li>
                    <li><strong>GPS:</strong> Para estimar tu posición entre dos lecturas de satélite.</li>
                    <li><strong>Finanzas:</strong> Para estimar precios de opciones en tiempos intermedios.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">La Fórmula Maestra</h2>
              </div>
              <p>
                El polinomio de interpolación de Lagrange <InlineMath math="P(x)" /> de grado <InlineMath math="n-1" /> se define como:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <BlockMath math="P(x) = \sum_{j=0}^{n} y_j L_j(x)" />
                <p className="text-center text-sm text-slate-400 mt-4">Donde los términos base <InlineMath math="L_j(x)" /> son:</p>
                <BlockMath math="L_j(x) = \prod_{i=0, i \neq j}^{n} \frac{x - x_i}{x_j - x_i}" />
              </div>

              <p className="text-slate-600">
                Parece intimidante, pero la lógica es simple: cada término <InlineMath math="L_j(x)" /> está diseñado para valer <strong>1</strong> en su punto correspondiente y <strong>0</strong> en todos los demás.
              </p>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Implementación en Python</h2>
              </div>
              <p className="mb-4">
                Así es como funciona nuestro motor en el Backend. Usamos bucles anidados para construir el producto de los términos.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>algoritmo_lagrange.py</span>
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
                <h2 className="text-2xl font-bold m-0">Ejemplo Resuelto</h2>
              </div>
              
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Problema:</h3>
                <p className="mb-4 text-slate-600">Encontrar el polinomio que pasa por los puntos: <strong>(1, 1)</strong>, <strong>(2, 4)</strong> y <strong>(3, 9)</strong>.</p>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  <p><strong>1. Calculamos L0(x) para x=1:</strong></p>
                  <p className="pl-4">((x-2)/(1-2)) * ((x-3)/(1-3)) = 0.5 * (x² - 5x + 6)</p>
                  
                  <p><strong>2. Calculamos L1(x) para x=2:</strong></p>
                  <p className="pl-4">((x-1)/(2-1)) * ((x-3)/(2-3)) = -1 * (x² - 4x + 3)</p>
                  
                  <p><strong>3. Sumamos todo (multiplicando por las Y):</strong></p>
                  <p className="pl-4 border-t pt-2 mt-2 border-slate-200">Resultado Simplificado: <strong>x²</strong></p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/interpolacion/lagrange">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                            Probar este ejemplo en el Simulador <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: APRENDER MÁS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Recursos Adicionales</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/Interpolaci%C3%B3n_polin%C3%B3mica_de_Lagrange" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-blue-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Definición formal y demostraciones.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=interpolacion+lagrange+explicacion" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Video tutoriales paso a paso.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                </div>
             </section>

          </article>

          {/* SIDEBAR DE NAVEGACIÓN (TABLA DE CONTENIDOS) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
                <h5 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">En esta página</h5>
                <ul className="space-y-3 text-sm border-l border-slate-200 pl-4">
                    <li><a href="#concepto" className="text-slate-500 hover:text-blue-600 hover:border-l-2 border-blue-600 -ml-[17px] pl-[15px] block transition-all">Concepto y Uso</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-blue-600 block transition-all">Fórmula Matemática</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-blue-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-blue-600 block transition-all">Ejemplo Resuelto</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-blue-600 block transition-all">Aprender Más</a></li>
                </ul>
                
                <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-semibold mb-2">¿LISTO PARA CALCULAR?</p>
                    <p className="text-xs text-blue-500 mb-4">Usa nuestro motor para resolver polinomios de grado N.</p>
                    <Link href="/interpolacion/lagrange">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-8 text-xs">Simulador Interactivo</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}