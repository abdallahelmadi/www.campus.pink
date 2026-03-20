import { IconSchool, IconSmallPerson, IconSmallTimer } from "@/icons"
import type { Allowance } from "@/interfaces"
import Image from "next/image"

export default function AllowanceFullCard({
  allowance
}: {
  allowance: Allowance
}): React.JSX.Element {
  return (
    <div className="relative w-full h-52 rounded-lg overflow-hidden select-none">
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
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1">
        <h1 className="text-white text-[17px] font-bold leading-tight text-balance">
          {allowance.name}
        </h1>
        {allowance.description && (
          <p className="text-white/70 text-[11px] line-clamp-2 leading-tight">
            {allowance.description}
          </p>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          {allowance.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-white/80 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <IconSmallTimer size={11} color="rgba(255,255,255,0.8)" />
              {allowance.duration} min
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
  )
}