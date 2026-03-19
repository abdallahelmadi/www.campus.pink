"use client"
import { IconRotateCounterClockwise } from "@/icons"
import { clearReservationsCache } from "@/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReloadReservationsButton(): React.JSX.Element {

  const route = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleClick(): Promise<void> {
    if (loading) return
    setLoading(true)
    const startTime = Date.now()

    await clearReservationsCache()
    route.refresh()

    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(0, 5000 - elapsedTime)

    setTimeout(() => {
      setLoading(false)
    }, remainingTime)
  }

  return (
    <div
      className="h-10 w-10 bg-[hsla(0,0%,100%,1)] shadow-[0_0_0_1px_#00000014]
      rounded-md flex items-center justify-center select-none overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <style>{`
        @keyframes spin-left {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .spin-left { animation: spin-left 5s linear infinite;}
      `}</style>
      <span className={`w-10 h-10 flex items-center justify-center ${loading ? "spin-left" : ""}`}>
        <IconRotateCounterClockwise />
      </span>
    </div>
  )
}