"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import type { Task } from "@/lib/types"
import { es } from "date-fns/locale"

export function TaskCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    // Load tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    setTasks(storedTasks)
  }, [])

  // Update selectedDayTasks when date changes
  useEffect(() => {
    if (!date) return

    const tasksForDay = tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })

    setSelectedDayTasks(tasksForDay)
  }, [date, tasks])

  return (
    <div className="grid gap-4 md:grid-cols-[400px_1fr]">
      <Card>
        <CardContent className="p-4">
          <Calendar mode="single" selected={date} onSelect={setDate} locale={es} className="w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Tareas para {date?.toLocaleDateString("es-ES", { dateStyle: "long" })}</h3>
          {selectedDayTasks.length === 0 ? (
            <p className="text-muted-foreground">No hay tareas programadas para este día</p>
          ) : (
            <div className="space-y-4">
              {selectedDayTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

