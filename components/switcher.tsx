export default function Switcher({
  upcoming,
  setStatus
}: {
  upcoming: "latest" | "today" | "upcoming"
  setStatus: (b: "latest" | "today" | "upcoming") => void
}): React.JSX.Element {
  return (
    <div
      className="h-10 bg-[hsla(0,0%,100%,1)] p-1 shadow-[0_0_0_1px_#00000014]
      rounded-md max-w-max flex items-center justify-between gap-1 select-none"
    >
      <label
        onClick={() => setStatus("latest")}
        className={`px-3 min-h-8 rounded-sm flex items-center hover:bg-[#fdfdfd]
        justify-center cursor-pointer transition duration-200 ease-in-out
        hover:text-black ${upcoming === "latest" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
      >
        latest
      </label>
      <label
        onClick={() => setStatus("today")}
        className={`px-3 min-h-8 rounded-sm flex items-center hover:bg-[#fdfdfd]
        justify-center cursor-pointer transition duration-200 ease-in-out
        hover:text-black ${upcoming === "today" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
      >
        today
      </label>
      <label
        onClick={() => setStatus("upcoming")}
        className={`px-3 min-h-8 rounded-sm flex items-center hover:bg-[#fdfdfd]
        justify-center cursor-pointer transition duration-200 ease-in-out
        hover:text-black ${upcoming === "upcoming" ? "bg-[hsla(0,0%,95%,1)] text-black" : "bg-white"}`}
      >
        upcoming
      </label>
    </div>
  )
}