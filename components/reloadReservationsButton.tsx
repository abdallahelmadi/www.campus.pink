"use client"
import { IconRotateCounterClockwise } from "@/icons"
import { clearReservationsCache } from "@/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReloadReservationsButton({
  disabled = false
}: {
  disabled?: boolean
}): React.JSX.Element {

  const route = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleClick(): Promise<void> {
    if (loading || disabled) return
    setLoading(true)
    const startTime = Date.now()

    await clearReservationsCache()
    route.refresh()

    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 6000 - elapsedTime)

    setTimeout(() => {
      setLoading(false)
    }, remainingTime)
  }

  return (
    <div
      className="h-10 w-10 bg-white shadow-[0_0_0_1px_#00000014]
      rounded-md flex items-center justify-center select-none overflow-hidden cursor-pointer
      transition duration-200 ease-in-out hover:bg-gray-100"
      onClick={handleClick}
    >
      <span className={`w-10 h-10 flex items-center justify-center ${loading ? "spin-left" : ""}`}>
        <IconRotateCounterClockwise />
      </span>
    </div>
  )
}