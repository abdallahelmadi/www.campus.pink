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

export {
  createGroupsByDate
}