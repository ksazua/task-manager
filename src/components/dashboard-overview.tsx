"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Star, ListTodo, Flag, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { CustomList, Task } from "@/lib/types"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { CreateListDialog } from "@/components/create-list-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { TaskService } from "@/lib/task-service"

export function DashboardOverview() {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isListDialogOpen, setIsListDialogOpen] = useState(false)
  const [selectedList, setSelectedList] = useState<CustomList | null>(null)
  const [stats, setStats] = useState({
    scheduled: 0,
    today: 0,
    important: 0,
    total: 0,
  })
  const [priorityTasks, setPriorityTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<CustomList[]>([])

  useEffect(() => {
    const loadData = () => {
      setStats(TaskService.getStatistics())
      setLists(TaskService.getLists())

      // Get priority tasks (P1 tasks that are not completed)
      const tasks = TaskService.getTasks()
      setPriorityTasks(
        tasks
          .filter((t) => t.priority === "p1" && t.status !== "completada")
          .sort((a, b) => {
            if (!a.dueDate || !b.dueDate) return 0
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          })
          .slice(0, 5),
      )
    }

    loadData()
    window.addEventListener("storage", loadData)
    return () => window.removeEventListener("storage", loadData)
  }, [])

  const statsConfig = [
    {
      title: "Programadas",
      value: stats.scheduled.toString(),
      icon: Calendar,
      color: "bg-blue-100",
    },
    {
      title: "Hoy",
      value: stats.today.toString(),
      icon: Clock,
      color: "bg-pink-100",
    },
    {
      title: "Importantes",
      value: stats.important.toString(),
      icon: Star,
      color: "bg-orange-100",
    },
    {
      title: "Todas las tareas",
      value: stats.total.toString(),
      icon: ListTodo,
      color: "bg-green-100",
    },
  ]

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <Card key={stat.title} className={`${stat.color} border-none`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Tareas Prioritarias</CardTitle>
            <Flag className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            {priorityTasks.length === 0 ? (
              <p className="text-muted-foreground">No hay tareas prioritarias</p>
            ) : (
              priorityTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="font-medium">{task.title}</p>
                    {task.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(task.dueDate), "PPP", { locale: es })}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      task.priority === "p1"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "p2"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    P{task.priority.charAt(1)}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mis listas</CardTitle>
              <Button variant="outline" size="icon" onClick={() => setIsListDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {lists.length === 0 ? (
              <p className="text-muted-foreground">No hay listas creadas</p>
            ) : (
              lists.map((list) => (
                <div key={list.id} className="flex">
                  <Link
                    href={`/dashboard/lists/${list.id}`}
                    className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{list.icon}</span>
                      <span className="font-medium">{list.name}</span>
                    </div>
                    <Plus
                      className="h-4 w-4 text-muted-foreground cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedList(list)
                        setIsTaskDialogOpen(true)
                      }}
                    />
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <CreateTaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        selectedList={selectedList}
        onSuccess={() => {
          setStats(TaskService.getStatistics())
          const tasks = TaskService.getTasks()
          setPriorityTasks(
            tasks
              .filter((t) => t.priority === "p1" && t.status !== "completada")
              .sort((a, b) => {
                if (!a.dueDate || !b.dueDate) return 0
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              })
              .slice(0, 5),
          )
        }}
      />
      <CreateListDialog
        open={isListDialogOpen}
        onOpenChange={setIsListDialogOpen}
        onSuccess={() => setLists(TaskService.getLists())}
      />
    </div>
  )
}

