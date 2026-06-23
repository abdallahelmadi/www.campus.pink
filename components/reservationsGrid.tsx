import { getReservations } from "@/actions"
import ReservationsClientGrid from "@/components/reservationsClientGrid"
import { createGroupsByDate } from "@/utils/server"

export default async function ReservationsGrid(): Promise<React.JSX.Element> {

  const [page1, page2, page3, page4] = await Promise.all([
    getReservations(1),
    getReservations(2),
    getReservations(3),
    getReservations(4)
  ])

  const reservations = [...page1, ...page2, ...page3, ...page4]

  const reservationsGroups = createGroupsByDate(reservations)

  return (
    <ReservationsClientGrid reservationsGroups={reservationsGroups}/>
  )
}