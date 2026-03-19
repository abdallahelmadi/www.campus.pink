import Header from "@/components/header"
import { getUser, getAllowances, getServices, getHolidays, getTimeSlotes, makeReservation } from "@/actions"
import { notFound, redirect } from "next/navigation"
import type { Allowance, Holiday, TimeSlote } from "@/interfaces"
import Breadcrumb from "@/components/breadcrumb"
import Image from "next/image"
import { IconSmallTimer, IconSmallPerson, IconSchool } from "@/icons"

function generateNext7Days(): { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[] {
  const days: { date: string; dayName: string; dayNumber: number; monthName: string; isToday: boolean }[] = []
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const dd = String(d.getDate()).padStart(2, "0")
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      monthName: monthNames[d.getMonth()],
      isToday: i === 0
    })
  }
  return days
}

function isHoliday(date: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find(h => h.date === date && h.isOff === "1")
}

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

async function ReservationContent({
  token,
  allowance,
  serviceId,
  allowanceId,
  holidays,
  selectedDate
}: {
  token: string
  allowance: Allowance
  serviceId: number
  allowanceId: number
  holidays: Holiday[]
  selectedDate: string
}) {
  const days = generateNext7Days()
  const holiday = isHoliday(selectedDate, holidays)
  const timeSlots: TimeSlote[] = holiday ? [] : await getTimeSlotes(token, allowanceId, selectedDate)

  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.4s_ease-out]">

      {/* Allowance Info Card */}
      <div className="relative w-full h-52 rounded-lg overflow-hidden">
        <Image
          src={allowance.image!}
          alt=""
          fill
          draggable={false}
          priority
          quality={100}
          sizes="(max-width: 768px) 100vw, 860px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
          <h1 className="text-white text-[18px] font-bold leading-tight text-balance">
            {allowance.name}
          </h1>
          {allowance.description && (
            <p className="text-white/70 text-[12px] line-clamp-2 leading-relaxed">
              {allowance.description}
            </p>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            {allowance.duration && (
              <span className="inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <IconSmallTimer size={11} color="rgba(255,255,255,0.8)" />
                {allowance.duration}min
              </span>
            )}
            {allowance.capacity && (
              <span className="inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <IconSmallPerson size={11} color="rgba(255,255,255,0.8)" />
                {allowance.capacity}
              </span>
            )}
            {allowance.campus?.name && (
              <span className="inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <IconSchool size={11} color="rgba(255,255,255,0.8)" />
                {allowance.campus.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Select a Date</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Date Picker Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => {
          const dayHoliday = isHoliday(day.date, holidays)
          const isSelected = day.date === selectedDate
          const isOff = !!dayHoliday

          return (
            <a
              key={day.date}
              href={`/services/${serviceId}/${allowanceId}?date=${day.date}`}
              className={`flex flex-col items-center justify-center min-w-16 h-20 rounded-xl border
                transition-all duration-200 ease-in-out select-none shrink-0
                ${isSelected
                  ? "bg-black text-white border-black shadow-lg shadow-black/20 scale-105"
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
            </a>
          )
        })}
      </div>

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

export default async function ServiceById({
  params,
  searchParams
}: {
  params: Promise<{ service_id: string; allowance_id: string }>
  searchParams: Promise<{ date?: string }>
}): Promise<React.JSX.Element> {

  const { service_id, allowance_id } = await params
  const { date } = await searchParams
  const serviceId = Number(service_id)
  const allowanceId = Number(allowance_id)

  if (isNaN(serviceId)) notFound()
  if (isNaN(allowanceId)) notFound()

  const user = await getUser()
  if (!user) redirect("/login")

  const [services, allowances, holidays] = await Promise.all([
    getServices(user.token),
    getAllowances(user.token, serviceId),
    getHolidays(user.token)
  ])

  const service = services.find(s => s.id === serviceId)
  if (!service) notFound()

  const allowance: Allowance | undefined = allowances.find(a => a.id === allowanceId)
  if (!allowance) notFound()

  const days = generateNext7Days()
  const selectedDate = date && days.some(d => d.date === date) ? date : days[0].date

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <Breadcrumb
          elements={[
            { href: "/services", label: "Services" },
            { href: `/services/${serviceId}`, label: service.name || "Service" },
            { href: `/services/${serviceId}/${allowanceId}`, label: allowance.name || "Allowance" }
          ]}
        />

        <div className="mt-3" />

        <ReservationContent
          token={user.token}
          allowance={allowance}
          serviceId={serviceId}
          allowanceId={allowanceId}
          holidays={holidays}
          selectedDate={selectedDate}
        />

      </main>
    </main>
  )
}












































// import Header from "@/components/header"
// import { getUser, getAllowances, getServices } from "@/actions"
// import { notFound } from "next/navigation"
// import type { Allowance } from "@/interfaces"
// import Breadcrumb from "@/components/breadcrumb"

// export default async function ServiceById({
//   params
// }: {
//   params: Promise<{ service_id: string; allowance_id: string }>
// }): Promise<React.JSX.Element> {

//   const { service_id, allowance_id } = await params
//   const serviceId = Number(service_id)
//   const allowanceId = Number(allowance_id)

//   if (isNaN(serviceId)) notFound()
//   if (isNaN(allowanceId)) notFound()

//   const user = await getUser()
//   if (!user) notFound()

//   const services = await getServices(user.token)
//   const service = services.find(s => s.id === serviceId)
//   if (!service) notFound()

//   const allowances: Allowance[] = await getAllowances(user.token, serviceId)
//   const allowance = allowances.find(a => a.id === allowanceId)
//   if (!allowance) notFound()

//   return (
//     <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
//       <main className="max-w-340 w-full flex flex-col gap-1">
    
//         <Header user={user} />

//         <Breadcrumb
//           elements={[
//             { href: "/services", label: "Services" },
//             { href: `/services/${serviceId}`, label: "..." },
//             { href: `/services/${serviceId}/${allowanceId}`, label: allowance.name || "allocation" }
//           ]}
//         />
      
//       </main>
//     </main>
//   )
// }