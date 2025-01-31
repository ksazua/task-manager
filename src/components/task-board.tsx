"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import type { Task, TaskStatus, CustomList } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag } from "lucide-react"
import { TaskService } from "@/lib/task-service"

const columns: { id: TaskStatus; title: string }[] = [
  { id: "pendiente", title: "Pendiente" },
  { id: "en-progreso", title: "En Progreso" },
  { id: "completada", title: "Completada" },
  { id: "eliminada", title: "Eliminada" },
]

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<CustomList[]>([])
  const [selectedList, setSelectedList] = useState<string>("all")

  useEffect(() => {
    const loadData = () => {
      setTasks(TaskService.getTasks())
      setLists(TaskService.getLists())
    }

    loadData()
    window.addEventListener("storage", loadData)
    return () => window.removeEventListener("storage", loadData)
  }, [])

  const filteredTasks = selectedList === "all" ? tasks : tasks.filter((task) => task.listId === selectedList)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    const updatedTasks = Array.from(tasks)
    const [movedTask] = updatedTasks.splice(source.index, 1)
    movedTask.status = destination.droppableId as TaskStatus
    updatedTasks.splice(destination.index, 0, movedTask)

    setTasks(updatedTasks)
    TaskService.saveTasks(updatedTasks)
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "p1":
        return "text-red-500"
      case "p2":
        return "text-orange-500"
      case "p3":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={selectedList} onValueChange={setSelectedList}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar lista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las listas</SelectItem>
            {lists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                <span className="mr-2">{list.icon}</span>
                {list.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <h3 className="font-semibold">{column.title}</h3>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                    {filteredTasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <CardHeader className="p-4">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                  <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
                                </div>
                              </CardHeader>
                              {(task.description || task.tags.length > 0) && (
                                <CardContent className="p-4 pt-0">
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                  )}
                                  {task.tags.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {task.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </CardContent>
                              )}
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

