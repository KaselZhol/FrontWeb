"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, AreaChart } from "lucide-react"

// Librerías para Fórmulas Matemáticas y Código
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function TrapecioTeoriaPage() {
  
  // Código Python
  const pythonCode = `def trapecio_compuesto(f, a, b, n):
    """
    Integra f(x) desde 'a' hasta 'b' usando 'n' trapecios.
    """
    h = (b - a) / n
    suma = f(a) + f(b) # Primer y último término
    
    # Sumamos los términos intermedios multiplicados por 2
    for i in range(1, n):
        x_i = a + i * h
        suma += 2 * f(x_i)
        
    resultado = (h / 2) * suma
    return resultado

# Ejemplo: Integral de x^2 de 0 a 1 con 4 segmentos
# f = lambda x: x**2
# area = trapecio_compuesto(f, 0, 1, 4)`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* HEADER DE NAVEGACIÓN */}
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
        
        {/* HERO DEL CAPÍTULO */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 mb-4 px-3 py-1 text-sm border-emerald-200 border">
            Capítulo 04 • Integración Numérica
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Regla del Trapecio
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            ¿Cómo calculamos el área bajo una curva compleja? Olvida los rectángulos de Riemann. 
            Conectando los puntos con líneas rectas formamos trapecios, logrando una aproximación mucho más precisa.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          {/* CONTENIDO PRINCIPAL */}
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            {/* SECCIÓN 1: INTUICIÓN */}
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Lightbulb size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Intuición Geométrica</h2>
              </div>
              
              <p>
                La integración definida es básicamente calcular el área. La aproximación clásica usa rectángulos (pasos), lo cual deja grandes huecos triangulares de error.
              </p>
              
              <p>
                La <strong>Regla del Trapecio</strong> mejora esto inclinando la parte superior del rectángulo para conectar los dos puntos de la función, formando... ¡un trapecio!
              </p>

              <Card className="bg-emerald-50 border-emerald-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                    <AreaChart size={18} />
                    Área de un Trapecio
                  </h4>
                  <p className="text-emerald-800 text-sm mb-4">
                    Recordemos geometría básica. El área es el promedio de las alturas por el ancho.
                  </p>
                  <div className="bg-white p-3 rounded border border-emerald-200 text-center">
                    <InlineMath math="A = \frac{h}{2} (y_0 + y_1)" />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* SECCIÓN 2: MATEMÁTICAS */}
            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">La Fórmula Compuesta</h2>
              </div>
              <p>
                Si aplicamos un solo trapecio gigante, el error es grande. El truco es dividir el área en <InlineMath math="n" /> trapecios pequeños de ancho <InlineMath math="h = \frac{b-a}{n}" />.
              </p>
              <p>
                Al sumar todos los trapecios, los lados internos se comparten (se suman dos veces), mientras que los extremos solo una vez:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-center">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Regla del Trapecio Compuesta</h3>
                <BlockMath math="I \approx \frac{h}{2} \left[ f(x_0) + 2 \sum_{i=1}^{n-1} f(x_i) + f(x_n) \right]" />
              </div>

              <p className="text-slate-600">
                Esta fórmula es la base de nuestro algoritmo. Es eficiente y fácil de programar.
              </p>
            </section>

            {/* SECCIÓN 3: CÓDIGO */}
            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Implementación en Python</h2>
              </div>
              <p className="mb-4">
                Observa cómo calculamos <code>h</code> y luego iteramos solo sobre los puntos intermedios para multiplicarlos por 2.
              </p>
              
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>algoritmo_trapecio.py</span>
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
              
              <div className="bg-white border border-emerald-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Integral de <InlineMath math="f(x) = x^2" /> de 0 a 1 (n=2)
                </h3>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  <p><strong>1. Calculamos el ancho (h):</strong></p>
                  <p className="pl-4">h = (1 - 0) / 2 = 0.5</p>
                  
                  {/* AQUÍ ESTABA EL ERROR: Usamos &rarr; para la flecha */}
                  <p><strong>2. Puntos (x) y Alturas f(x):</strong></p>
                  <ul className="pl-8 list-disc">
                     <li>x0 = 0.0 &rarr; f(0) = 0</li>
                     <li>x1 = 0.5 &rarr; f(0.5) = 0.25 (Intermedio, se multiplica x2)</li>
                     <li>x2 = 1.0 &rarr; f(1) = 1</li>
                  </ul>
                  
                  <p><strong>3. Aplicamos la fórmula:</strong></p>
                  <p className="pl-4">I ≈ (0.5 / 2) * [0 + 2(0.25) + 1]</p>
                  <p className="pl-4">I ≈ 0.25 * [1.5] = <strong>0.375</strong></p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
                     Nota: El valor real es 1/3 ≈ 0.333. Trapecio tiene algo de error aquí, Simpson lo mejoraría.
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/integracion">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            Probar en el Simulador <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

             {/* SECCIÓN 5: RECURSOS */}
             <section id="recursos" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-6">Aprender Más</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <a href="https://es.wikipedia.org/wiki/Regla_del_trapecio" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-emerald-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <ExternalLink className="text-slate-400" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">Wikipedia</h5>
                                    <p className="text-sm text-slate-500">Demostración del error.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                    <a href="https://www.youtube.com/results?search_query=regla+trapecio+explicacion" target="_blank" rel="noopener noreferrer">
                        <Card className="hover:border-red-400 cursor-pointer transition-all hover:shadow-md">
                            <CardContent className="p-4 flex items-center gap-3">
                                <Play className="text-red-500" size={20}/>
                                <div>
                                    <h5 className="font-semibold text-slate-900">YouTube</h5>
                                    <p className="text-sm text-slate-500">Tutoriales visuales.</p>
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
                    <li><a href="#concepto" className="text-slate-500 hover:text-emerald-600 hover:border-l-2 border-emerald-600 -ml-[17px] pl-[15px] block transition-all">Geometría</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-emerald-600 block transition-all">Fórmula Maestra</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-emerald-600 block transition-all">Código Python</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-emerald-600 block transition-all">Ejemplo Resuelto</a></li>
                    <li><a href="#recursos" className="text-slate-500 hover:text-emerald-600 block transition-all">Recursos</a></li>
                </ul>
                
                <div className="mt-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-semibold mb-2">INTEGRACIÓN IA</p>
                    <p className="text-xs text-emerald-500 mb-4">Calcula integrales definidas al instante.</p>
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