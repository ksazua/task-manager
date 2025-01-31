import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard-overview"
import { TaskCalendar } from "@/components/task-calendar"
import { TaskBoard } from "@/components/task-board"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Panel de Control",
  description: "Panel de control de tareas",
}

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 py-8 px-8 md:px-16">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Hola, bienvenido a ListDo</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="kanban">Tablero</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview />
        </TabsContent>
        <TabsContent value="kanban" className="space-y-4">
          <TaskBoard />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <TaskCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
}

