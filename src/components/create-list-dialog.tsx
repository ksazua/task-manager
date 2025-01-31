"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EmojiPicker } from "@/components/emoji-picker"
import { TaskService } from "@/lib/task-service"

interface CreateListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateListDialog({ open, onOpenChange, onSuccess }: CreateListDialogProps) {
  const [icon, setIcon] = useState("📝")
  const [color, setColor] = useState("#FF5733")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (!name.trim()) return

    setIsLoading(true)
    try {
      const newList = {
        id: Date.now().toString(),
        name,
        icon,
        color,
        userId: "1",
      }

      TaskService.addList(newList)

      // Reset form
      setName("")
      setIcon("📝")
      setColor("#FF5733")

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Error creating list:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Lista</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Nombre de la lista" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Icono</Label>
            <EmojiPicker onEmojiSelect={(emoji: any) => setIcon(emoji.native)}>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-2 text-xl">{icon}</span>
                Seleccionar icono
              </Button>
            </EmojiPicker>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 p-1"
              />
              <div className="flex-1 rounded-md" style={{ backgroundColor: color }} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Lista"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

