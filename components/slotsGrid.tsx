import { getTimeSlotes } from "@/actions"
import type { Holiday, TimeSlote } from "@/interfaces"
import { IconClockDashed, IconWarning } from "@/icons"
import SlotCard from "@/components/slotCard"
import { getCapacityPercentage, getStatusLabel } from "@/utils/server"

export default async function SlotsGrid({
  holiday,
  token,
  allowanceId,
  selectedDate
}: {
  holiday: Holiday | undefined
  token: string
  allowanceId: number
  selectedDate: string
}): Promise<React.JSX.Element> {

  if (holiday && holiday.isOff === "1") {
    return (
      <div
        className="border border-amber-200 bg-amber-50 rounded-lg p-2.5 flex
        items-center justify-start gap-3 animate-[fadeIn_0.3s_ease-out] select-none"
      >
        <div
          className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200
          flex items-center justify-center shrink-0"
        >
          <IconWarning size={16} color="#d97706" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-semibold text-amber-800">
            {holiday.event || "Holiday"}
          </span>
          <span className="text-[11px] text-amber-600 leading-relaxed">
            {holiday.description || "This day is marked as a holiday"}
          </span>
        </div>
      </div>
    )
  }

  const timeSlots: TimeSlote[] = await getTimeSlotes(token, allowanceId, selectedDate)

  if (timeSlots.length === 0) {
    return (
      <div
        className="border border-gray-200 rounded-lg p-8 flex flex-col items-center
        gap-3 bg-gray-50 animate-[fadeIn_0.3s_ease-out] select-none"
      >
        <div
          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200
          flex items-center justify-center"
        >
          <IconClockDashed size={19} color="#9ca3af" />
        </div>
        <p className="text-[13px] text-gray-500 text-center">
          No time slots available for this date
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out]">
      {timeSlots.map((slot, index) => {
        const status = getStatusLabel(slot)
        const isBookable = slot.canBook && !slot.isPause && !slot.isMaintenance
        const isWaiting = slot.waitingList && !slot.isPause && !slot.isMaintenance
        const capacityPct = getCapacityPercentage(slot)

        return <SlotCard
          key={index}
          index={index}
          status={status}
          isBookable={isBookable}
          isWaiting={isWaiting}
          capacityPct={capacityPct}
          slot={slot}
          token={token}
          allowanceId={allowanceId}
          selectedDate={selectedDate}
        />
      })}
    </div>
  )
}