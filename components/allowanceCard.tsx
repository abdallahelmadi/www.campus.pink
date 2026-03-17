import type { Allowance } from "@/interfaces"
import Image from "next/image"

export default function AllowanceCard({
  allowance
}: {
  allowance: Allowance
}): React.JSX.Element {
  return (
    <div
      className={`group relative bg-gray-50 border border-gray-200
      rounded-lg overflow-hidden transition duration-200 ease-in-out
      hover:border-gray-300 hover:shadow-sm
      ${allowance.enable !== 1 ? "opacity-50 pointer-events-none" : ""}`}
    >

      <div className="relative w-full h-36 overflow-hidden">
        <Image
          src={allowance.image!}
          alt=""
          fill
          draggable={false}
          quality={90}
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-center
          group-hover:scale-103 transition-transform duration-300 ease-in-out"
        />
        {allowance.enable !== 1 && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <span className="text-[11px] font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-medium text-black truncate">
            {allowance.name}
          </h3>
          {allowance.gender && (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5
            rounded-full bg-gray-100 border border-gray-200 text-gray-500 uppercase tracking-wide">
              {allowance.gender}
            </span>
          )}
        </div>

        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
          {allowance.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {allowance.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {allowance.duration} min
            </span>
          )}
          {allowance.capacity && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 14C2 11.2386 4.68629 9 8 9C11.3137 9 14 11.2386 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {allowance.capacity}
            </span>
          )}
          {allowance.campus?.name && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L1 5.5L8 10L15 5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M3 7V12L8 15L13 12V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              {allowance.campus.name}
            </span>
          )}
        </div>
      </div>

    </div>
  )
}