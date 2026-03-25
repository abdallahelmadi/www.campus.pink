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

function getStatusLabel(slot: TimeSlote, selectedDate?: string): { text: string; style: string } {
  if (slot.start && selectedDate) {
    const [year, month, day] = selectedDate.split("-").map(Number)
    const [hours, minutes] = slot.start.split(":").map(Number)
    const slotDateTime = new Date(year, month - 1, day, hours, minutes, 0)
    const now = new Date()
    now.setHours(now.getHours() + 1) // (GMT+1)
    if (slotDateTime <= now) return { text: "Passed", style: "bg-gray-100 text-gray-500 border-gray-200" }
  }
  if (slot.isMaintenance) return { text: "Maintenance", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (slot.isPause) return { text: "Break", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (slot.waitingList) return { text: "Waiting List", style: "bg-amber-50 text-amber-600 border-amber-200" }
  if (slot.canBook) return { text: "Available", style: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  return { text: "Full", style: "bg-red-50 text-red-600 border-red-200" }
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
  getStatusLabel,
  formatTime,
  getCapacityPercentage,
  getCapacityColor,
  getCapacityBg
}