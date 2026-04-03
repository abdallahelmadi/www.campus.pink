import { IconArrowLeft } from "@/icons"
import Link from "next/link"

export default function Switcher({
  upcoming,
  setStatus
}: {
  upcoming: "latest" | "today" | "upcoming"
  setStatus: (b: "latest" | "today" | "upcoming") => void
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/"
        className="h-10 w-10 bg-white shadow-[0_0_0_1px_#00000014]
        rounded-md flex items-center justify-center select-none overflow-hidden cursor-pointer
        transition duration-200 ease-in-out hover:bg-gray-100"
      >
        <span className="w-10 h-10 flex items-center justify-center">
          <IconArrowLeft />
        </span>
      </Link>
      <div
        className="h-10 bg-[hsla(0,0%,100%,1)] p-1 shadow-[0_0_0_1px_#00000014]
        rounded-md max-w-max flex items-center justify-between gap-1 select-none"
      >
        <label
          onClick={() => setStatus("today")}
          className={`px-3 min-h-8 rounded-sm flex items-center
          justify-center cursor-pointer transition duration-200 ease-in-out
          hover:text-black ${upcoming === "today" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
        >
          today
        </label>
        <label
          onClick={() => setStatus("upcoming")}
          className={`px-3 min-h-8 rounded-sm flex items-center
          justify-center cursor-pointer transition duration-200 ease-in-out
          hover:text-black ${upcoming === "upcoming" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
        >
          upcoming
        </label>
                <label
          onClick={() => setStatus("latest")}
          className={`px-3 min-h-8 rounded-sm flex items-center
          justify-center cursor-pointer transition duration-200 ease-in-out
          hover:text-black ${upcoming === "latest" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
        >
          latest
        </label>
      </div>
    </div>
  )
}