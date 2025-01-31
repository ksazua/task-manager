"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Task } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Flag, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
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
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-3 rounded-lg border p-4 hover:bg-muted/50">
          <Checkbox checked={completedTasks.includes(task.id)} onCheckedChange={() => toggleTask(task.id)} />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className={completedTasks.includes(task.id) ? "line-through" : ""}>{task.title}</span>
              <Flag className={`h-4 w-4 ${getPriorityColor(task.priority)}`} />
            </div>
            {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(task.dueDate, "PPP", { locale: es })}
                </div>
              )}
              {task.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

