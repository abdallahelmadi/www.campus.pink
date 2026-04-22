import { getReservations } from "@/actions"
import ReservationsClientGrid from "@/components/reservationsClientGrid"
import Empty from "@/components/empty"
import { createGroupsByDate } from "@/utils/server"

export default async function ReservationsGrid({
  token
}: {
  token: string | undefined
}): Promise<React.JSX.Element> {

  if (!token) {
    return (
      <Empty>
        You don&apos;t have any reservations yet<br/>
        Explore better-campus and book your first sport session
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

  console.log("RESERVATIONS", reservations)

  const reservationsGroups = createGroupsByDate(reservations)

  return (
    <ReservationsClientGrid
      reservationsGroups={reservationsGroups}
      token={token}
    />
  )
}