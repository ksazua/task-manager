import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type React from "react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4", className)} {...props}>
      <Button variant="ghost" className="px-0" asChild>
        <Link href="/dashboard">Inicio</Link>
      </Button>
      <Button variant="ghost" className="px-0" asChild>
        <Link href="/dashboard/projects">Proyectos</Link>
      </Button>
      <Button variant="ghost" className="px-0" asChild>
        <Link href="/dashboard/tasks">Tareas</Link>
      </Button>
    </nav>
  )
}

