"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Folder, MoreVertical, CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import type { Project, Task, TaskStatus } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskService } from "@/lib/task-service"

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      const allProjects = TaskService.getProjects()
      const currentProject = allProjects.find((p) => p.id === projectId) || null
      setProject(currentProject)

      const allTasks = TaskService.getTasks()
      const projectTasks = allTasks.filter((task) => task.projectId === projectId)
      setTasks(projectTasks)
    }

    loadData()
    window.addEventListener("storage", loadData)
    return () => window.removeEventListener("storage", loadData)
  }, [projectId])

  if (!project) {
    return <div className="py-8 px-8 md:px-16">Proyecto no encontrado</div>
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setTasks(items)
    TaskService.saveTasks(items)
  }

  const handleCompleteTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: (task.status === "completada" ? "pendiente" : "completada") as TaskStatus }
        : task,
    )
    setTasks(updatedTasks)
    TaskService.saveTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    TaskService.saveTasks(updatedTasks)
  }

  return (
    <div className="py-8 px-8 md:px-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-8 w-8" style={{ color: project.color }} />
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="board">Tablero</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {tasks.length === 0 ? (
                        <p className="text-muted-foreground">No hay tareas en este proyecto</p>
                      ) : (
                        tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between rounded-lg border p-4 ${
                                  task.status === "completada" ? "bg-muted" : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Button variant="ghost" size="icon" onClick={() => handleCompleteTask(task.id)}>
                                    <CheckCircle2
                                      className={`h-5 w-5 ${
                                        task.status === "completada" ? "text-primary" : "text-muted-foreground"
                                      }`}
                                    />
                                  </Button>
                                  <div>
                                    <p className={task.status === "completada" ? "line-through" : ""}>{task.title}</p>
                                    {task.description && (
                                      <p className="text-sm text-muted-foreground">{task.description}</p>
                                    )}
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                                      {task.status === "completada" ? "Desmarcar" : "Completar"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="board">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Vista de tablero próximamente...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateTaskDialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setIsCreateTaskDialogOpen}
        selectedProject={project}
        onSuccess={() => {
          const allTasks = TaskService.getTasks()
          const projectTasks = allTasks.filter((t) => t.projectId === projectId)
          setTasks(projectTasks)
        }}
      />
    </div>
  )
}

