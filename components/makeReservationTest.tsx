"use client"
import { useState } from "react"

export default function MakeReservationTest(): React.JSX.Element {

  const [fetch, setFetch] = useState<boolean>(false)

  return (
    <>

      <button
        onClick={() => setFetch(true)}
      >
        click me
      </button>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        tabIndex={-1}
      >
        <div
          className={`shadow-tool cursor-default flex w-full h-full overflow-hidden bg-surface
          border border-secondary md:rounded-xl relative text-primary justify-center md:w-100 md:h-auto p-4 md:p-8 pointer-events-auto
          ${fetch ? "opacity-100 blur-0  perspective-normal" : "opacity-0 blur-md  perspective-none"} min-h-100`}
        >
          ;
        </div>
      </div>

    </>
  )
}