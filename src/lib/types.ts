export type TaskPriority = "p1" | "p2" | "p3" | "p4"

export type TaskStatus = "pendiente" | "en-progreso" | "completada" | "eliminada"

export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  reminderEndDate?: Date
  listId?: string
  projectId?: string
  userId: string
  createdAt: Date
  tags: string[]
  isImportant: boolean
}

export type CustomList = {
  id: string
  name: string
  icon: string
  color: string
  userId: string
}

export type Project = {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
  userId: string
}

