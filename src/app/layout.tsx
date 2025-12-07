import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <--- CAMBIO 1: Importamos Inter correctamente
import "./globals.css";
import { Sidebar } from "@/components/ui/Sidebar";

// Configuramos la fuente Inter (la estándar de Shadcn)
const inter = Inter({ subsets: ["latin"] });

// <--- CAMBIO 2: Dejamos solo UN bloque de metadata
export const metadata: Metadata = {
  title: "Plataforma Numérica",
  description: "Sistema de Modelado Matemático",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos la fuente Inter al body */}
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex min-h-screen">
          
          {/* BARRA LATERAL FIJA */}
          <Sidebar />
          
          {/* CONTENIDO PRINCIPAL 
              (lg:pl-72 empuja el contenido a la derecha en pantallas grandes 
               para que el menú no tape el texto) 
          */}
          <main className="flex-1 lg:pl-72">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}