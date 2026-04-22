"use client"
import type { Reservation } from "@/interfaces"
import { useState } from "react"
import ReservationCard from "@/components/reservationCard"
import Empty from "@/components/empty"
import Switcher from "@/components/switcher"
import ReloadReservationsButton from "@/components/reloadReservationsButton"
import { filteredReservationsGroups, formatDateLabel } from "@/utils/client"

export default function ReservationsClientGrid({
  reservationsGroups,
  token
}: {
  reservationsGroups: Map<string, Reservation[]>
  token: string
}): React.JSX.Element {

  const [status, setStatus] = useState<"latest" | "today" | "upcoming">("today")
  const filteredGroups = filteredReservationsGroups(reservationsGroups, status)

  return (
    <main className="w-full flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <Switcher
          upcoming={status}
          setStatus={setStatus}
        />
        <ReloadReservationsButton token={token} />
      </div>

      {(filteredGroups.size === 0 && status === "upcoming") && (
        <Empty>
          You have no upcoming reservations
        </Empty>
      )}

      {(filteredGroups.size === 0 && status === "today") && (
        <Empty>
          You have no reservations for today
        </Empty>
      )}

      {filteredGroups.size > 0 && [...filteredGroups.entries()].map(([dateKey, reservations]) => (
        <div
          key={dateKey}
          className="flex flex-col gap-2"
        >
          <span className="text-[13px] font-semibold text-gray-800 px-1">
            {formatDateLabel(dateKey)}
          </span>
          <div
            suppressHydrationWarning
            className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-340
            lg:grid-cols-3 xl:grid-cols-4 gap-2"
          >

            {reservations.map(reservation => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                token={token}
              />
            ))}

          </div>
        </div>
      ))}
    
    </main>
  )
}