"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import type { CustomList, Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskList } from "@/components/task-list"
import { TaskService } from "@/lib/task-service"

export default function ListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: listId } = use(params)
  const [list, setList] = useState<CustomList | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      const allLists = TaskService.getLists()
      const currentList = allLists.find((l) => l.id === listId) || null
      setList(currentList)

      const allTasks = TaskService.getTasks()
      const listTasks = allTasks.filter((t) => t.listId === listId)
      setTasks(listTasks)
    }

    loadData()
    window.addEventListener("storage", loadData)
    return () => window.removeEventListener("storage", loadData)
  }, [listId])

  if (!list) {
    return <div className="py-8 px-8 md:px-16">Lista no encontrada</div>
  }

  return (
    <div className="py-8 px-8 md:px-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{list.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{list.name}</h1>
            <p className="text-muted-foreground">{tasks.length} tareas</p>
          </div>
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
        selectedList={list}
        onSuccess={() => {
          const allTasks = TaskService.getTasks()
          const listTasks = allTasks.filter((t) => t.listId === listId)
          setTasks(listTasks)
        }}
      />
    </div>
  )
}

