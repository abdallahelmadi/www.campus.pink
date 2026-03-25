import type { Holiday, Reservation, TimeSlote } from "@/interfaces"

function createGroupsByDate(reservations: Reservation[]): Map<string, Reservation[]> {
  const grouped = new Map<string, Reservation[]>()
  for (const r of reservations) {
    if (!r.start) continue
    const dateKey = r.start.split(" ")[0]
    if (!grouped.has(dateKey)) grouped.set(dateKey, [])
    grouped.get(dateKey)!.push(r)
  }
  return grouped
}

function generateNext7Days(): { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[] {
  const days: { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[] = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isToday: i === 0
    })
  }
  return days
}

function isHoliday(date: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find(h => h.date === date && h.isOff === "1")
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "--:--"
  const parts = timeStr.split(":")
  if (parts.length < 2) return timeStr
  return `${parts[0]}:${parts[1]}`
}

function getCapacityPercentage(slot: TimeSlote): number {
  if (slot.capacity <= 0) return 100
  return Math.round((slot.reserved / slot.capacity) * 100)
}

function getCapacityColor(slot: TimeSlote): string {
  const pct = getCapacityPercentage(slot)
  if (pct >= 90) return "bg-red-500"
  if (pct >= 70) return "bg-amber-500"
  if (pct >= 40) return "bg-yellow-400"
  return "bg-emerald-500"
}

function getCapacityBg(slot: TimeSlote): string {
  const pct = getCapacityPercentage(slot)
  if (pct >= 90) return "bg-red-50"
  if (pct >= 70) return "bg-amber-50"
  if (pct >= 40) return "bg-yellow-50"
  return "bg-emerald-50"
}

export {
  createGroupsByDate,
  generateNext7Days,
  isHoliday,
  formatTime,
  getCapacityPercentage,
  getCapacityColor,
  getCapacityBg
}