"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, ScanEye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"

// 1. DEFINIMOS LA INTERFAZ CON LA PROP OPCIONAL (?)
interface ScannerProps {
  onScanComplete?: (data: any) => void; 
}

// 2. RECIBIMOS LA PROP (con valor por defecto vacío)
export default function ProblemScanner({ onScanComplete }: ScannerProps = {}) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

      // --- LÓGICA HÍBRIDA ---
      
      // CASO A: Estamos dentro de una herramienta (Ej: RK4)
      // Si el componente padre nos dio una función, la usamos y NO redirigimos.
      if (onScanComplete) {
        // Extraemos solo los parámetros relevantes si vienen anidados
        const paramsLimpios = data.parametros || data; 
        onScanComplete(paramsLimpios)
        setIsOpen(false)
        return; // Terminamos aquí
      }

      // CASO B: Estamos en la Home
      // No hay función, así que usamos la lógica de redirección automática.
      if (data.ruta_sugerida) {
        const params = new URLSearchParams()
        Object.entries(data.parametros).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.append(key, String(value))
            }
        })
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
        <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors">
          <ScanEye className="h-4 w-4" />
          <span className="hidden sm:inline">Escanear</span> IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Asistente Matemático IA</DialogTitle>
          <DialogDescription>
            Sube una foto. Yo detectaré los datos y los escribiré por ti.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-6 py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          {loading ? (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm font-medium text-slate-600 animate-pulse">Analizando imagen...</p>
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