"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { MoreVertical, Folder, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import type { Project } from "@/lib/types"
import Link from "next/link"
import { TaskService } from "@/lib/task-service"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)

  useEffect(() => {
    const loadProjects = () => {
      setProjects(TaskService.getProjects())
    }

    loadProjects()
    window.addEventListener("storage", loadProjects)
    return () => window.removeEventListener("storage", loadProjects)
  }, [])

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(projects)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProjects(items)
    TaskService.saveProjects(items)
  }

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    setProjects(updatedProjects)
    TaskService.saveProjects(updatedProjects)
  }

  return (
    <div className="py-8 px-8 md:px-16 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
          <p className="text-muted-foreground">Gestiona y organiza tus proyectos</p>
        </div>
        <Button onClick={() => setIsCreateProjectDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {projects.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">No hay proyectos creados</p>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project, index) => (
                  <Draggable key={project.id} draggableId={project.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <Folder className="h-4 w-4" style={{ color: project.color }} />
                                  <span>{project.name}</span>
                                </div>
                              </CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.preventDefault()}>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>Editar</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      handleDeleteProject(project.id)
                                    }}
                                  >
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardHeader>
                            <CardContent>
                              <CardDescription>{project.description}</CardDescription>
                            </CardContent>
                          </Card>
                        </Link>
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

      <CreateProjectDialog
        open={isCreateProjectDialogOpen}
        onOpenChange={setIsCreateProjectDialogOpen}
        onSuccess={() => setProjects(TaskService.getProjects())}
      />
    </div>
  )
}

