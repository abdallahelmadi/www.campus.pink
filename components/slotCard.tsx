"use client"
import { makeReservation } from "@/actions"
import { IconClockDashed, IconChevronRightSmall, IconLoader } from "@/icons"
import type { TimeSlote } from "@/interfaces"
import { formatTime, getCapacityColor } from "@/utils/server"
import { useState } from "react"

export default function SlotCard({
  status,
  isBookable,
  isWaiting,
  capacityPct,
  slot,
  token,
  allowanceId,
  selectedDate,
  index
}: {
  status: { text: string; style: string }
  isBookable: boolean
  isWaiting: boolean
  capacityPct: number
  slot: TimeSlote
  token: string
  allowanceId: number
  selectedDate: string
  index: number
}): React.JSX.Element {

  const [isBooking, setIsBooking] = useState<boolean>(false)
  const [statusText, setStatusText] = useState<string>(status.text)

  async function handleBook() {
    if (!isBookable || isWaiting || isBooking) return
    setIsBooking(true)
    try {
      const res = await makeReservation(token, allowanceId, selectedDate, slot.id)
      if (res.success) {
        setStatusText("Reserved")
      } else {
        setStatusText("Failed")
      }
    } catch (error) {
      setStatusText("Failed")
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div
      style={{ animationDelay: `${index * 60}ms` }}
      className="animate-[slideUp_0.4s_ease-out_both]"
      onClick={handleBook}
    >
      <button
        disabled={!isBookable && !isWaiting}
        className={`w-full text-left rounded-xl border p-3.5 transition-all duration-200 ease-in-out group/slot
          ${isBookable
            ? "bg-white border-gray-200 hover:border-gray-400 hover:-translate-y-0.5 cursor-pointer"
            : isWaiting
              ? "bg-amber-50/50 border-amber-200 cursor-not-allowed opacity-60"
              : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
          }
        `}
      >
        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border
              ${isBookable
                ? "bg-black text-white border-black group-hover/slot:scale-105 transition-transform duration-200"
                : isWaiting
                  ? "bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-gray-100 text-gray-400 border-gray-200"
              }`}
            >
              <IconClockDashed size={18} color="currentColor"/>
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

          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${status.style}`}>
              {statusText}
            </span>
            {isBookable && (
              <div
                className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center
                group-hover/slot:bg-gray-200 group-hover/slot:border-gray-300 transition-all duration-200"
              >
                {isBooking ? <IconLoader color="black"/> : <IconChevronRightSmall color="black"/>}
              </div>
            )}
          </div>

        </div>
      </button>
    </div>
  )
}