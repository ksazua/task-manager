import type { Task, CustomList, Project } from "@/lib/types"

const TASKS_KEY = "tasks"
const LISTS_KEY = "lists"
const PROJECTS_KEY = "projects"

export const TaskService = {
  // Tasks
  getTasks: (): Task[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]")
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    window.dispatchEvent(new Event("storage"))
  },

  addTask: (task: Task) => {
    const tasks = TaskService.getTasks()
    tasks.push(task)
    TaskService.saveTasks(tasks)
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    const tasks = TaskService.getTasks()
    const index = tasks.findIndex((t) => t.id === taskId)
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates }
      TaskService.saveTasks(tasks)
    }
  },

  deleteTask: (taskId: string) => {
    const tasks = TaskService.getTasks()
    const filtered = tasks.filter((t) => t.id !== taskId)
    TaskService.saveTasks(filtered)
  },

  // Lists
  getLists: (): CustomList[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(LISTS_KEY) || "[]")
  },

  saveLists: (lists: CustomList[]) => {
    localStorage.setItem(LISTS_KEY, JSON.stringify(lists))
    window.dispatchEvent(new Event("storage"))
  },

  addList: (list: CustomList) => {
    const lists = TaskService.getLists()
    lists.push(list)
    TaskService.saveLists(lists)
  },

  // Projects
  getProjects: (): Project[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]")
  },

  saveProjects: (projects: Project[]) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
    window.dispatchEvent(new Event("storage"))
  },

  addProject: (project: Project) => {
    const projects = TaskService.getProjects()
    projects.push(project)
    TaskService.saveProjects(projects)
  },

  // Statistics
  getStatistics: () => {
    const tasks = TaskService.getTasks()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return {
      scheduled: tasks.filter((t) => t.dueDate).length,
      today: tasks.filter((t) => {
        if (!t.dueDate) return false
        const taskDate = new Date(t.dueDate)
        taskDate.setHours(0, 0, 0, 0)
        return taskDate.getTime() === today.getTime()
      }).length,
      important: tasks.filter((t) => t.isImportant).length,
      total: tasks.length,
    }
  },
}

