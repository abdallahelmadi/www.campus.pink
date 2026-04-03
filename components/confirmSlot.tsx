"use client"
import { useState } from "react"
import { IconLoader } from "@/icons"

export default function ConfirmSlot({
  active,
  cancel,
  handleBook,
  allowanceName
}: {
  active: boolean
  cancel: () => void
  handleBook: () => Promise<void>
  allowanceName: string | null
}): React.JSX.Element {

  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div
      className={`fixed inset-0 z-100 bg-[hsl(0deg_0%_98%/50%)]
      ${active ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}
      transition-opacity duration-300 ease-in-out`}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) cancel()
      }}
    >

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-120 h-auto bg-white rounded-t-2xl border
        border-gray-200 transition-transform duration-300 ease-in-out p-4 gap-4
        ${active ? "translate-y-0" : "translate-y-full"} flex flex-col justify-between`}
      >

        <div className="text-[13px] text-gray-700">
          You are about to reserve a slot for <span className="font-semibold text-black">{allowanceName || "this service"}</span>, do you want to proceed?
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            className="h-11 rounded-md border border-gray-300 text-gray-700
            hover:bg-gray-100 transition-colors duration-200 ease-in-out w-full"
            onClick={cancel}
          >
            Cancel
          </button>
          <button
            className="h-11 rounded-md border border-gray-300 text-white bg-black
            hover:bg-black/90 transition-colors duration-200 ease-in-out w-full flex items-center justify-center gap-2"
            onClick={async () => {
              setLoading(true)
              await handleBook()
              setLoading(false)
            }}
          >
            {loading && <IconLoader size={16} color="white"/>}
            Confirm
          </button>
        </div>

      </div>

    </div>
  )
}