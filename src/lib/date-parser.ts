import { parse, isValid } from "date-fns"
import { es } from "date-fns/locale"

export function parseDateFromText(text: string): Date | null {
  // Common Spanish date patterns
  const patterns = [
    "hoy",
    "mañana",
    "próximo lunes",
    "próximo martes",
    "próximo miércoles",
    "próximo jueves",
    "próximo viernes",
    "próximo sábado",
    "próximo domingo",
    "el lunes",
    "el martes",
    "el miércoles",
    "el jueves",
    "el viernes",
    "el sábado",
    "el domingo",
  ]

  const lowercaseText = text.toLowerCase()

  // Check for date patterns in the text
  for (const pattern of patterns) {
    if (lowercaseText.includes(pattern)) {
      const today = new Date()

      switch (pattern) {
        case "hoy":
          return today
        case "mañana":
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          return tomorrow
        default:
          // Handle "próximo" and "el" patterns
          const dayMatch = pattern.match(/(lunes|martes|miércoles|jueves|viernes|sábado|domingo)/)
          if (dayMatch) {
            const targetDay = dayMatch[1]
            const daysMap = {
              lunes: 1,
              martes: 2,
              miércoles: 3,
              jueves: 4,
              viernes: 5,
              sábado: 6,
              domingo: 0,
            }
            const targetDayNum = daysMap[targetDay as keyof typeof daysMap]
            const currentDay = today.getDay()
            let daysToAdd = targetDayNum - currentDay
            if (daysToAdd <= 0) daysToAdd += 7
            const futureDate = new Date(today)
            futureDate.setDate(today.getDate() + daysToAdd)
            return futureDate
          }
      }
    }
  }

  // Try to parse explicit dates
  const dateAttempt = parse(text, "d/M/yyyy", new Date(), { locale: es })
  if (isValid(dateAttempt)) {
    return dateAttempt
  }

  return null
}

