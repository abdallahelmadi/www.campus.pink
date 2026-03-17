import { getReservations, getUser } from "@/actions"
import type { Reservation } from "@/interfaces"
import { Suspense } from "react"
import Footer from "@/components/footer"
import ReservationsClientGrid from "@/components/reservationsClientGrid"
import Header from "@/components/header"
import Empty from "@/components/empty"
import ReservationSkeleton from "@/components/reservationSkeleton"
import Link from "next/link"
import { IconChevronRightSmall } from "@/icons"
import Breadcrumb from "@/components/breadcrumb"

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

export default async function Reservations(): Promise<React.JSX.Element> {

  const user = await getUser()
  const token = user?.token

  if (!token) {
    return (
      <>
        <Header user={undefined} />
        <Breadcrumb
          elements={[
            { href: "/reservations", label: "Reservations" }
          ]}
        />
        <Empty className="p-2">
          You need to be logged in to see your reservations.<br/>
          Please login!
        </Empty>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header user={user} />
      <Breadcrumb
        elements={[
          { href: "/reservations", label: "Reservations" }
        ]}
      />
      <Suspense fallback={<ReservationSkeleton />}>
        <ReservationsGrid token={token} />
      </Suspense>
      <Footer />
    </>
  )
}

async function ReservationsGrid({
  token
}: {
  token: string
}): Promise<React.JSX.Element> {

  const [page1, page2, page3, page4] = await Promise.all([
    getReservations(token, 1),
    getReservations(token, 2),
    getReservations(token, 3),
    getReservations(token, 4)
  ])

  const reservations = [...page1, ...page2, ...page3, ...page4]

  if (reservations.length === 0) {
    return (
      <Empty className="p-2 mt-14">
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