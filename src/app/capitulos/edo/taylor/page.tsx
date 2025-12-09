"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, BookOpen, Code, Lightbulb, Calculator, ExternalLink, Play, TrendingUp } from "lucide-react"
import { BlockMath, InlineMath } from 'react-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function TaylorTeoriaPage() {
  
  const pythonCode = `def taylor_orden_2(f, f_prime, t0, y0, h, n_pasos):
    """
    f: Función de la primera derivada (y')
    f_prime: Función de la segunda derivada (y'')
    """
    t = t0
    y = y0
    resultados = [(t, y)]
    
    for _ in range(n_pasos):
        # 1. Primera derivada (velocidad)
        yp = f(t, y)
        
        # 2. Segunda derivada (aceleración)
        ypp = f_prime(t, y)
        
        # 3. Fórmula de Taylor (Orden 2)
        y = y + (h * yp) + ((h**2 / 2) * ypp)
        t = t + h
        
        resultados.append((t, y))
        
    return resultados`

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
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
                    <Play className="h-4 w-4 mr-2" /> Ir al Simulador Taylor
                </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mb-4 px-3 py-1 text-sm border-indigo-200 border">
            Capítulo 07 • Ecuaciones Diferenciales
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Series de Taylor (Orden 2)
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-8">
            Euler asume que el cambio es lineal (línea recta). Taylor va un paso más allá: asume que el cambio es curvo (una parábola), logrando mayor precisión a cambio de calcular derivadas extra.
          </p>
        </motion.div>

        <hr className="my-12 border-slate-100" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
          
          <article className="prose prose-slate max-w-none lg:prose-lg">
            
            <section id="concepto" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><TrendingUp size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Más allá de la recta</h2>
              </div>
              
              <p>
                Si lanzas una piedra, al principio parece ir recta (Euler), pero la gravedad la curva hacia abajo. Taylor de Orden 2 incluye esa "curvatura" (aceleración) en el cálculo.
              </p>
              
              <Card className="bg-indigo-50 border-indigo-100 my-6">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-indigo-900 mb-2">Diferencia Clave:</h4>
                  <ul className="pl-5 space-y-2 text-indigo-800 text-sm">
                    <li><strong>Euler:</strong> Usa <InlineMath math="y'" /> (Velocidad). Error <InlineMath math="O(h)" />.</li>
                    <li><strong>Taylor 2:</strong> Usa <InlineMath math="y'" /> y <InlineMath math="y''" /> (Aceleración). Error <InlineMath math="O(h^2)" />.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="matematica" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><BookOpen size={24} /></div>
                <h2 className="text-2xl font-bold m-0">La Expansión en Serie</h2>
              </div>
              <p>
                Cualquier función suave se puede aproximar sumando sus derivadas. Si cortamos la serie en el segundo término, obtenemos:
              </p>
              
              <div className="my-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-center">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Fórmula Taylor Orden 2</h3>
                <BlockMath math="y_{n+1} = y_n + h f(t_n, y_n) + \frac{h^2}{2} f'(t_n, y_n)" />
              </div>

              <p className="text-slate-600 text-sm">
                Nota: <InlineMath math="f'(t, y)" /> es la <strong>Derivada Implícita</strong>. Si <InlineMath math="y' = t - y" />, entonces <InlineMath math="y'' = 1 - y'" />.
              </p>
            </section>

            <section id="codigo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Code size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Código Python</h2>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
                <div className="bg-slate-900 text-slate-400 px-4 py-2 text-xs font-mono border-b border-slate-800 flex justify-between">
                  <span>taylor_solver.py</span>
                  <span>Python 3.9+</span>
                </div>
                <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{margin: 0, padding: '1.5rem'}}>
                  {pythonCode}
                </SyntaxHighlighter>
              </div>
            </section>

            <section id="ejemplo" className="mb-16 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Calculator size={24} /></div>
                <h2 className="text-2xl font-bold m-0">Ejemplo Manual</h2>
              </div>
              
              <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    <InlineMath math="y' = y" />, con <InlineMath math="y(0) = 1" />
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                    Sabemos que <InlineMath math="y'' = y' = y" />. Usamos paso <InlineMath math="h=0.1" />.
                </p>
                
                <div className="space-y-4 font-mono text-sm bg-slate-50 p-4 rounded-lg text-slate-700">
                  <p><strong>Paso 1 (Euler):</strong></p>
                  <p>y = 1 + 0.1(1) = 1.1</p>
                  
                  <div className="border-t border-slate-300 my-2"></div>
                  
                  <p><strong>Paso 1 (Taylor 2):</strong></p>
                  <p>y = 1 + 0.1(1) + <strong>(0.1²/2)(1)</strong></p>
                  <p>y = 1 + 0.1 + 0.005 = <strong>1.105</strong></p>
                  
                  <p className="text-xs text-green-600 mt-2 font-bold">
                    ¡Exacto! (e^0.1 ≈ 1.1051). Taylor acertó los primeros 3 decimales.
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <Link href="/edo/euler">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Probar en el Simulador (Selecciona Taylor) <ArrowRight size={16} className="ml-2"/>
                        </Button>
                    </Link>
                </div>
              </div>
            </section>

          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
                <h5 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Contenido</h5>
                <ul className="space-y-3 text-sm border-l border-slate-200 pl-4">
                    <li><a href="#concepto" className="text-slate-500 hover:text-indigo-600 block transition-all">Curvatura</a></li>
                    <li><a href="#matematica" className="text-slate-500 hover:text-indigo-600 block transition-all">Fórmula Orden 2</a></li>
                    <li><a href="#codigo" className="text-slate-500 hover:text-indigo-600 block transition-all">Código</a></li>
                    <li><a href="#ejemplo" className="text-slate-500 hover:text-indigo-600 block transition-all">Ejemplo</a></li>
                </ul>
                
                <div className="mt-8 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">REQUIERE y''</p>
                    <p className="text-xs text-indigo-500 mb-4">Debes ingresar la segunda derivada manualmente.</p>
                    <Link href="/edo/euler">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 text-xs">Simulador</Button>
                    </Link>
                </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}