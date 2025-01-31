"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Task } from "@/lib/types"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskList } from "@/components/task-list"
import { TaskService } from "@/lib/task-service"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const loadTasks = () => {
      setTasks(TaskService.getTasks())
    }

    loadTasks()
    window.addEventListener("storage", loadTasks)
    return () => window.removeEventListener("storage", loadTasks)
  }, [])

  return (
    <div className="py-8 px-8 md:px-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tareas</h2>
          <p className="text-muted-foreground">Gestiona tus tareas diarias</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <TaskList tasks={tasks} />

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => setTasks(TaskService.getTasks())}
      />
    </div>
  )
}

