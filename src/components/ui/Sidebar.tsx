"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Calculator, 
  Activity, 
  TrendingUp, 
  Sigma, 
  Home 
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Inicio", href: "/", icon: Home },
    { 
      title: "Ecuaciones Diferenciales",
      items: [
        { name: "Método de Euler", href: "/edo/euler", icon: Activity },
        { name: "Runge-Kutta 4", href: "/edo/rk4", icon: Activity },
      ]
    },
    { 
      title: "Interpolación",
      items: [
        { name: "Lagrange", href: "/interpolacion/lagrange", icon: Calculator },
        { name: "Newton", href: "/interpolacion/newton", icon: Calculator },
      ]
    },
    { 
      title: "Cálculo Integral",
      items: [
        { name: "Trapecio / Simpson", href: "/integracion", icon: Sigma },
      ]
    },
    { 
        title: "Ajuste de Curvas",
        items: [
          { name: "Mínimos Cuadrados", href: "/ajuste", icon: TrendingUp },
        ]
      },
  ]

  return (
    <div className="hidden border-r bg-slate-50/40 lg:block lg:w-72 lg:fixed lg:inset-y-0 z-10">
      <div className="flex h-16 items-center px-6 border-b bg-white">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="p-1 bg-slate-900 rounded text-white"><Calculator size={18}/></span>
          Harvard Math
        </h2>
      </div>
      <ScrollArea className="h-full py-6 px-4">
        <div className="space-y-6">
          {links.map((section: any, i) => (
            <div key={i}>
              {section.title && (
                <h4 className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items ? (
                  section.items.map((item: any) => (
                    <Button
                      key={item.href}
                      asChild
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  ))
                ) : (
                  <Button
                    asChild
                    variant={pathname === section.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Link href={section.href}>
                      <section.icon className="h-4 w-4" />
                      {section.name}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}