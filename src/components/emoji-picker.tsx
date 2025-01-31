"use client"

import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { useTheme } from "next-themes"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type React from "react" // Import React

interface EmojiPickerProps {
  children: React.ReactNode
  onEmojiSelect: (emoji: any) => void
}

export function EmojiPicker({ children, onEmojiSelect }: EmojiPickerProps) {
  const { theme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full p-0 border-none">
        <Picker
          data={data}
          onEmojiSelect={onEmojiSelect}
          theme={theme === "dark" ? "dark" : "light"}
          locale="es"
          previewPosition="none"
          skinTonePosition="none"
        />
      </PopoverContent>
    </Popover>
  )
}

