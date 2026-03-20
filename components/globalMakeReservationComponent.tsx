import type { Allowance, Holiday, TimeSlote } from "@/interfaces"
import { IconSmallTimer } from "@/icons"
import AllowanceFullCard from "@/components/allowanceFullCard"
import TitleSection from "@/components/titleSection"
import { getTimeSlotes, getUser, makeReservation } from "@/actions"
import { redirect } from "next/navigation"
import DatePickerStrip from "@/components/datePickerStrip"
import { isHoliday } from "@/utils/server"





function formatTime(timeStr: string | null): string {
  if (!timeStr) return "--:--"
  const parts = timeStr.split(":")
  if (parts.length < 2) return timeStr
  return `${parts[0]}:${parts[1]}`
}

function getCapacityPercentage(slot: TimeSlote): number {
  if (slot.capacity <= 0) return 100
  return Math.round((slot.reserved / slot.capacity) * 100)
}

function getCapacityColor(slot: TimeSlote): string {
  const pct = getCapacityPercentage(slot)
  if (pct >= 90) return "bg-red-500"
  if (pct >= 70) return "bg-amber-500"
  if (pct >= 40) return "bg-yellow-400"
  return "bg-emerald-500"
}

function getCapacityBg(slot: TimeSlote): string {
  const pct = getCapacityPercentage(slot)
  if (pct >= 90) return "bg-red-50 border-red-200"
  if (pct >= 70) return "bg-amber-50 border-amber-200"
  if (pct >= 40) return "bg-yellow-50 border-yellow-200"
  return "bg-emerald-50 border-emerald-200"
}

function getStatusLabel(slot: TimeSlote): { text: string; style: string } {
  if (slot.isMaintenance) return { text: "Maintenance", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (slot.isPause) return { text: "Break", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (!slot.canBook && !slot.waitingList) return { text: "Full", style: "bg-red-50 text-red-600 border-red-200" }
  if (slot.waitingList) return { text: "Waiting List", style: "bg-amber-50 text-amber-600 border-amber-200" }
  return { text: "Available", style: "bg-emerald-50 text-emerald-700 border-emerald-200" }
}






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
  const timeSlots: TimeSlote[] = holiday ? [] : await getTimeSlotes(token, allowanceId, selectedDate)

  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">

      <AllowanceFullCard allowance={allowance}/>

      <TitleSection title="SELECT DATE"/>

      <DatePickerStrip
        serviceId={serviceId}
        allowanceId={allowanceId}
        days={days}
        selectedDate={selectedDate}
        holidays={holidays}
      />

      {/* Holiday Notice */}
      {holiday && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 15H15L8 1Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 6V9" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="12" r="0.75" fill="#D97706" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-amber-800">
              {holiday.event || "Holiday"}
            </span>
            <span className="text-[12px] text-amber-600 leading-relaxed">
              {holiday.description || "This day is marked as a holiday. No reservations are available."}
            </span>
          </div>
        </div>
      )}

      {/* Time Slots */}
      {!holiday && (
        <>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Available Slots</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {timeSlots.length === 0 ? (
            <div className="border border-gray-200 rounded-lg p-8 flex flex-col items-center gap-3 bg-gray-50 animate-[fadeIn_0.3s_ease-out]">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <IconSmallTimer size={20} color="#9ca3af" />
              </div>
              <p className="text-[13px] text-gray-500 text-center">No time slots available for this date</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out]">
              {timeSlots.map((slot, index) => {
                const status = getStatusLabel(slot)
                const isBookable = slot.canBook && !slot.isPause && !slot.isMaintenance
                const isWaiting = slot.waitingList && !slot.isPause && !slot.isMaintenance
                const capacityPct = getCapacityPercentage(slot)

                return (
                  <form
                    key={slot.id}
                    action={async () => {
                      "use server"
                      const user = await getUser()
                      if (!user) redirect("/login")
                      const result = await makeReservation(user.token, allowanceId, selectedDate, slot.id)
                      if (result.success) {
                        redirect("/reservations")
                      }
                    }}
                    style={{ animationDelay: `${index * 60}ms` }}
                    className="animate-[slideUp_0.4s_ease-out_both]"
                  >
                    <button
                      type={isBookable || isWaiting ? "submit" : "button"}
                      disabled={!isBookable && !isWaiting}
                      className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 ease-in-out group/slot
                        ${isBookable
                          ? "bg-white border-gray-200 hover:border-black hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                          : isWaiting
                            ? "bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                            : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-3">

                        {/* Left: Time */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border
                            ${isBookable
                              ? "bg-black text-white border-black group-hover/slot:scale-105 transition-transform duration-200"
                              : isWaiting
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : "bg-gray-100 text-gray-400 border-gray-200"
                            }`}
                          >
                            <IconSmallTimer size={18} color="currentColor" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className={`text-[14px] font-semibold ${isBookable ? "text-black" : isWaiting ? "text-amber-800" : "text-gray-400"}`}>
                              {formatTime(slot.start)} - {formatTime(slot.end)}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[11px] ${isBookable ? "text-gray-500" : "text-gray-400"}`}>
                                {slot.reserved}/{slot.capacity} reserved
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ease-out ${getCapacityColor(slot)}`}
                                  style={{ width: `${Math.min(capacityPct, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status + Arrow */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.style}`}>
                            {status.text}
                          </span>
                          {(isBookable || isWaiting) && (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center
                              group-hover/slot:bg-black group-hover/slot:border-black transition-all duration-200">
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                                className="text-gray-400 group-hover/slot:text-white transition-colors duration-200">
                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          )}
                        </div>

                      </div>
                    </button>
                  </form>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Footer spacing */}
      <div className="h-4" />
    </div>
  )
}