"use client"
import type { Reservation } from "@/interfaces"
import { IconFingerPrint, IconGeneration, IconLoader } from "@/icons"
import { useState } from "react"
import Image from "next/image"
import ReservationQrCode from "@/components/reservationQrCode"
import { changeReservationStatus } from "@/actions"
import { useRouter } from "next/navigation"

const statusStyles = {
  approved: {
    dot: "bg-blue-600",
    text: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 border border-blue-200"
  },
  absent: {
    dot: "bg-red-600",
    text: "text-red-600",
    badge: "bg-red-100 text-red-700 border border-red-200"
  },
  upcoming: {
    dot: "bg-purple-600",
    text: "text-purple-600",
    badge: "bg-purple-100 text-purple-700 border border-purple-200"
  },
  canceled: {
    dot: "bg-gray-400",
    text: "text-gray-600",
    badge: "bg-gray-100 text-gray-700 border border-gray-200"
  }
}

export default function ReservationCard({
  reservation
}: {
  reservation: Reservation
}): React.JSX.Element {

  const router = useRouter()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [canceling, setCanceling] = useState<boolean>(false)
  const [cancelingError, setCancelingError] = useState<boolean>(false)
  const [status, setStatus] = useState<"approved" | "absent" | "upcoming" | "canceled">(reservation.status || "canceled")
  const styles = statusStyles[status]

  async function handleCanceling(reservationId: string) {
    try {

      if (cancelingError || canceling) return
      setCanceling(true)

      const res = await changeReservationStatus(reservationId, 3)

      if (!res.success) throw new Error("")
      
      setCanceling(false)
      setStatus("canceled")
      router.refresh()

    } catch {
      setCanceling(false)
      setCancelingError(true)
      setTimeout(() => setCancelingError(false), 2000)
    }
  }

  return (
    <div className="select-none group">

      <ReservationQrCode
        code={qrCode}
        removeCode={() => setQrCode(null)}
      />

      <div className="h-42 w-full border border-gray-200 bg-gray-200 overflow-hidden relative">
        <Image
          src={reservation.image!}
          alt=""
          fill
          draggable={false}
          loading="eager"
          priority
          quality={100}
          suppressHydrationWarning
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center absolute inset-0 outline-none z-1
          group-hover:scale-103 transition-transform duration-300 ease-in-out cursor-pointer"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-2 pl-3 z-2">
          <p className="text-white text-[13px] font-medium line-clamp-1">
            {reservation.name}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-1">

        <div className="flex flex-col gap-1">

          <div className="flex items-center">
            <div className={`rounded-[5px] w-2.5 h-2.5 inline-block ${styles.dot} mr-1`}/>
            <span className={`${styles.text} text-[12px] font-medium`}>
              {status}
            </span>
          </div>

          <div
            className={`font-medium text-[13px] flex h-5.5 px-2 rounded-[50px]
            shrink-0 max-w-max items-center justify-center ${styles.badge}`}
          >
            {reservation.start?.split(" ")[1]}
          </div>

        </div>

        <div className="flex items-center gap-2">

          {status === "upcoming" && (
            <div
              suppressHydrationWarning
              className="px-2.5 h-9 max-w-max rounded-[50px] flex items-center justify-center
              border border-red-200 cursor-pointer transition duration-200 ease-in-out
              hover:bg-red-100 bg-red-50 gap-3"
              onClick={async () => await handleCanceling(reservation.id!)}
            >
              <span className="text-[12px] font-medium text-red-600">
                { cancelingError ? "error" : `cancel${canceling ? "ing" : ""}` }
              </span>
              { canceling ? <IconLoader color="red"/> : <IconGeneration color="red"/> }
            </div>
          )}

          <div
            suppressHydrationWarning
            className="w-9 h-9 rounded-full flex items-center justify-center
            border border-gray-300 cursor-pointer transition duration-200 ease-in-out
            hover:bg-gray-100 bg-white"
            onClick={() => setQrCode(reservation.qrCode)}
          >
            <IconFingerPrint />
          </div>

        </div>

      </div>

    </div>
  )
}