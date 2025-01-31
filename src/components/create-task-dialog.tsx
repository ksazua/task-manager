"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Clock, Repeat, Hash, Star, ImageIcon, X, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { CustomList, TaskPriority, Task, TaskStatus } from "@/lib/types"
import { parseDateFromText } from "@/lib/date-parser"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskService } from "@/lib/task-service"

interface Project {
  id: string
  name: string
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedList?: CustomList | null
  selectedProject?: Project | null
  onSuccess?: () => void
}

const priorities: { value: TaskPriority; label: string; color: string }[] = [
  { value: "p1", label: "Prioridad 1", color: "text-red-500" },
  { value: "p2", label: "Prioridad 2", color: "text-orange-500" },
  { value: "p3", label: "Prioridad 3", color: "text-blue-500" },
  { value: "p4", label: "Prioridad 4", color: "text-gray-500" },
]

const repeatOptions = [
  { value: "daily", label: "Diariamente" },
  { value: "weekly", label: "Semanalmente" },
  { value: "monthly", label: "Mensualmente" },
  { value: "yearly", label: "Anualmente" },
]

const availableTags = ["Trabajo", "Personal", "Compras", "Salud", "Familia", "Viajes", "Estudio", "Finanzas"]

export function CreateTaskDialog({
  open,
  onOpenChange,
  selectedList,
  selectedProject,
  onSuccess,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>("")
  const [isImportant, setIsImportant] = useState(false)
  const [priority, setPriority] = useState<TaskPriority>("p4")
  const [suggestedDate, setSuggestedDate] = useState<Date | null>(null)
  const [repeat, setRepeat] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const [isRepeatOpen, setIsRepeatOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [reminderEndDate, setReminderEndDate] = useState<Date>()
  const [isReminderEndDateOpen, setIsReminderEndDateOpen] = useState(false)

  useEffect(() => {
    if (title) {
      const detected = parseDateFromText(title)
      setSuggestedDate(detected)
    } else {
      setSuggestedDate(null)
    }
  }, [title])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleSuggestedDateAccept = () => {
    if (suggestedDate) {
      setDate(suggestedDate)
      setSuggestedDate(null)
    }
  }

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (!title.trim()) return

    setIsLoading(true)
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        description,
        status: "pendiente" as TaskStatus,
        priority,
        dueDate: date,
        reminderEndDate,
        listId: selectedList?.id,
        projectId: selectedProject?.id,
        userId: "1",
        createdAt: new Date(),
        tags,
        isImportant,
      }

      TaskService.addTask(newTask)

      // Reset form
      setTitle("")
      setDescription("")
      setDate(undefined)
      setTime("")
      setReminderEndDate(undefined)
      setIsImportant(false)
      setPriority("p4")
      setTags([])

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Nueva tarea</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedList && <p className="text-sm text-muted-foreground">En lista: {selectedList.name}</p>}
          {selectedProject && <p className="text-sm text-muted-foreground">En proyecto: {selectedProject.name}</p>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <Input
              placeholder="¿Qué hay que hacer?"
              className="text-lg font-medium"
              value={title}
              onChange={handleTitleChange}
            />
            {suggestedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                Fecha detectada: {format(suggestedDate, "PPP", { locale: es })}
                <Button variant="ghost" size="sm" onClick={handleSuggestedDateAccept}>
                  Aceptar
                </Button>
              </div>
            )}
            <Textarea
              placeholder="Descripción (opcional)"
              className="min-h-[100px]"
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 opacity-70" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                </PopoverContent>
              </Popover>
            </div>
            {repeat && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <Popover open={isReminderEndDateOpen} onOpenChange={setIsReminderEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !reminderEndDate && "text-muted-foreground",
                      )}
                    >
                      {reminderEndDate ? format(reminderEndDate, "PPP", { locale: es }) : "Fecha fin recordatorio"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={reminderEndDate}
                      onSelect={setReminderEndDate}
                      initialFocus
                      locale={es}
                      disabled={(date) => date < new Date() || (date && date <= date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 opacity-70" />
              <Popover open={isTimePickerOpen} onOpenChange={setIsTimePickerOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {time || "Agregar hora"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <div className="grid gap-2 p-4">
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    <Button onClick={() => setIsTimePickerOpen(false)}>Aceptar</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Repeat className="h-4 w-4 opacity-70" />
              <Popover open={isRepeatOpen} onOpenChange={setIsRepeatOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {repeatOptions.find((o) => o.value === repeat)?.label || "Repetir"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {repeatOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            onSelect={() => {
                              setRepeat(option.value)
                              setIsRepeatOpen(false)
                            }}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 opacity-70" />
              <Popover open={isTagsOpen} onOpenChange={setIsTagsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "Agregar etiquetas"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandList>
                      <CommandInput placeholder="Buscar etiquetas..." />
                      <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
                      <CommandGroup>
                        {availableTags.map((tag) => (
                          <CommandItem key={tag} onSelect={() => toggleTag(tag)}>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={tags.includes(tag)} onCheckedChange={() => toggleTag(tag)} />
                              {tag}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4 opacity-70" />
              <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value} className={p.color}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-orange-400" />
            <Label htmlFor="important">Marcar como importante</Label>
            <Switch id="important" checked={isImportant} onCheckedChange={setIsImportant} />
          </div>
          <Button variant="ghost" className="w-full justify-start text-primary">
            <ImageIcon className="mr-2 h-4 w-4" />
            Agregar imagen
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

