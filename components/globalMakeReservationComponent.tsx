import type { Allowance, Holiday } from "@/interfaces"
import AllowanceFullCard from "@/components/allowanceFullCard"
import TitleSection from "@/components/titleSection"
import DatePickerStrip from "@/components/datePickerStrip"
import { isHoliday } from "@/utils/server"
import SlotsGrid from "@/components/slotsGrid"
import { Suspense } from "react"
import SlotsSkeleton from "@/components/slotsSkeleton"

export default async function GlobalMakeReservationComponent({
  token,
  allowance,
  serviceId,
  allowanceId,
  holidays,
  selectedDate,
  days
}: {
  token: string
  allowance: Allowance
  serviceId: number
  allowanceId: number
  holidays: Holiday[]
  selectedDate: string
  days: { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[]
}
): Promise<React.JSX.Element> {

  const holiday = isHoliday(selectedDate, holidays)

  return (
    <div className="flex flex-col gap-2 animate-[fadeIn_0.4s_ease-out]">

      <AllowanceFullCard allowance={allowance}/>

      <div className="mt-1"/>

      <TitleSection title="SELECT DATE"/>

      <DatePickerStrip
        serviceId={serviceId}
        allowanceId={allowanceId}
        days={days}
        selectedDate={selectedDate}
        holidays={holidays}
      />

      <TitleSection title="AVAILABLE SLOTS"/>

      <div className="mt-1"/>

      <Suspense fallback={<SlotsSkeleton />}>
        <SlotsGrid
          holiday={holiday}
          token={token}
          allowanceId={allowanceId}
          selectedDate={selectedDate}
        />
      </Suspense>

    </div>
  )
}