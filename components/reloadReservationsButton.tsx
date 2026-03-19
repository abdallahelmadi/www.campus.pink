"use client"
import { IconRotateCounterClockwise } from "@/icons"
import { clearReservationsCache } from "@/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReloadReservationsButton(): React.JSX.Element {

  const route = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleClick(): Promise<void> {
    setLoading(true)
    await clearReservationsCache()
    route.refresh()
    setLoading(false)
  }

  return (
    <div
      className="h-10 w-10 bg-[hsla(0,0%,100%,1)] shadow-[0_0_0_1px_#00000014]
      rounded-md flex items-center justify-center select-none overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <span className={`w-10 h-10 ${loading ? "animate-spin" : ""}`}>
        <IconRotateCounterClockwise />
      </span>
    </div>
  )
}