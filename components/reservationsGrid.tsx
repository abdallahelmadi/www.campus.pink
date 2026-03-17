import { getReservations } from "@/actions"
import type { Reservation } from "@/interfaces"
import ReservationsClientGrid from "@/components/reservationsClientGrid"
import Empty from "@/components/empty"

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

export default async function ReservationsGrid({
  token
}: {
  token: string | undefined
}): Promise<React.JSX.Element> {

  if (!token) {
    return (
      <Empty>
        You need to be logged in to see your reservations.<br/>
        Please login!
      </Empty>
    )
  }

  const [page1, page2, page3, page4] = await Promise.all([
    getReservations(token, 1),
    getReservations(token, 2),
    getReservations(token, 3),
    getReservations(token, 4)
  ])

  const reservations = [...page1, ...page2, ...page3, ...page4]

  if (reservations.length === 0) {
    return (
      <Empty>
        You don't have any reservations yet.<br/>
        Explore better-campus and book your first sport session!
      </Empty>
    )
  }

  const reservationsGroups = createGroupsByDate(reservations)

  return (
    <ReservationsClientGrid
      reservationsGroups={reservationsGroups}
      token={token}
    />
  )
}