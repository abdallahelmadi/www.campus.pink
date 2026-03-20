import type { Reservation } from "@/interfaces"

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

export {
  createGroupsByDate,
  generateNext7Days
}