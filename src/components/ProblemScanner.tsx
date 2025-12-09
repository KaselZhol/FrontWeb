"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation" // <--- IMPORTANTE PARA REDIRIGIR
import { Button } from "@/components/ui/button"
import { Loader2, Upload, ScanEye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"

export default function ProblemScanner() {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter() // Hook de navegación

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("https://api-modelado.onrender.com/ai/scan-problem", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Error en el servidor AI")

      const data = await res.json()
      console.log("IA Dice:", data)

      // --- AQUÍ OCURRE LA MAGIA DE LA REDIRECCIÓN ---
      if (data.ruta_sugerida) {
        // Convertimos los parámetros en una Query String (ej: ?ecuacion=x+2&t0=0)
        const params = new URLSearchParams()
        
        Object.entries(data.parametros).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, String(value))
            }
        })

        // Redirigimos al usuario a la página correcta con los datos
        setIsOpen(false)
        router.push(`${data.ruta_sugerida}?${params.toString()}`)
      } else {
        alert("No pude identificar el tipo de problema.")
      }

    } catch (error) {
      console.error(error)
      alert("Error al analizar la imagen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Este es el botón que se verá en la Home */}
        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-white/50 hover:bg-white text-slate-700 border-slate-300 hover:border-blue-400 backdrop-blur-sm text-base transition-all">
            <ScanEye className="mr-2 h-5 w-5 text-blue-600" /> Escanear Problema (IA)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Asistente Matemático IA</DialogTitle>
          <DialogDescription>
            Sube una foto. Yo detectaré si es EDO, Integral o Interpolación y te llevaré a la herramienta correcta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          {loading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm font-medium text-slate-600 animate-pulse">Analizando y clasificando...</p>
            </div>
          ) : (
            <>
              <Button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Upload className="mr-2 h-4 w-4" /> Subir Imagen
              </Button>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}