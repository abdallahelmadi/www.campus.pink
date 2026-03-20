import type { Holiday } from "@/interfaces"
import { isHoliday } from "@/utils/server"
import Link from "next/link"

export default function DatePickerStrip({
  serviceId,
  allowanceId,
  days,
  holidays,
  selectedDate
}: {
  serviceId: number
  allowanceId: number
  days: { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[]
  holidays: Holiday[]
  selectedDate: string
}): React.JSX.Element {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-none h-26 items-center">
      {days.map((day) => {
        const dayHoliday = isHoliday(day.date, holidays)
        const isSelected = day.date === selectedDate
        const isOff = !!dayHoliday && dayHoliday.isOff === "1"
        return (
          <Link
            key={day.date}
            href={`/services/${serviceId}/${allowanceId}?date=${day.date}`}
            className={`flex flex-col items-center justify-center min-w-16 h-20 rounded-md border
              transition-all duration-200 ease-in-out select-none shrink-0
              ${isSelected
                ? "bg-black/90 text-white border-black shadow-lg shadow-black/20"
                : isOff
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm hover:-translate-y-0.5"
              }
            `}
          >
            <span className={`text-[10px] font-medium uppercase tracking-wide ${isSelected ? "text-white/60" : isOff ? "text-gray-300" : "text-gray-400"}`}>
              {day.dayName}
            </span>
            <span className={`text-[22px] font-bold leading-none mt-0.5 ${isSelected ? "text-white" : isOff ? "text-gray-300" : "text-gray-800"}`}>
              {day.dayNumber}
            </span>
            <span className={`text-[9px] font-medium mt-0.5 ${isSelected ? "text-white/60" : isOff ? "text-gray-300" : "text-gray-400"}`}>
              {day.monthName}
            </span>
            {day.isToday && (
              <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-black"}`} />
            )}
          </Link>
        )
      })}
    </div>
  )
}