"use client"
import type { Reservation } from "@/interfaces"
import { useState } from "react"
import ReservationCard from "@/components/reservationCard"
import Empty from "@/components/empty"
import Switcher from "@/components/switcher"
import ReloadReservationsButton from "./reloadReservationsButton"

const days = [
  "Sunday", "Monday",
  "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
]

const months = [
  "January", "February", "March",
  "April", "May", "June", "July", "August",
  "September", "October", "November", "December"
]

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr.replace(" ", "T"))
  const day = days[date.getDay()]
  const d = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${d} ${month} ${year}`
}

export default function ReservationsClientGrid({
  reservationsGroups,
  token
}: {
  reservationsGroups: Map<string, Reservation[]>
  token: string
}): React.JSX.Element {

  const [status, setStatus] = useState<"latest" | "today" | "upcoming">("latest")

  const filteredGroups = status === "today"
  ? new Map<string, Reservation[]>(
      [...reservationsGroups.entries()]
      .map(([dateKey, reservations]) => {
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
        const reservationDateStr = dateKey.split(" ")[0]
        return [
          dateKey,
          reservationDateStr === todayStr 
          ? reservations.filter(r => r.status === "upcoming")
          : []
        ] as const
      })
      .filter(([, reservations]) => reservations.length > 0)
    )
  : status === "upcoming"
  ? new Map<string, Reservation[]>(
      [...reservationsGroups.entries()]
      .map(([dateKey, reservations]) => [
        dateKey,
        reservations.filter(r => r.status === "upcoming")
      ] as const)
      .filter(([, reservations]) => reservations.length > 0)
    )
  : reservationsGroups

  return (
    <main className="w-full flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <Switcher
          upcoming={status}
          setStatus={setStatus}
        />
        <ReloadReservationsButton />
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
            lg:grid-cols-3 xl:grid-cols-4 gap-4"
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