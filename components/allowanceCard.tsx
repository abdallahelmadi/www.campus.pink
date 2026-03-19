import { IconSchool, IconSmallPerson, IconSmallTimer } from "@/icons"
import type { Allowance } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"
import { IconStar, IconStarFill } from "@/icons"

export default function AllowanceCard({
  allowance,
  serviceId,
  removeFromFavorite,
  addToFavorite,
  isFavorite
}: {
  allowance: Allowance
  serviceId: number
  removeFromFavorite: () => void
  addToFavorite: () => void
  isFavorite: boolean
}): React.JSX.Element {
  return (
    <Link href={`/services/${serviceId}/${allowance.enable !== 1 ? "" : allowance.id}`}>
      <div
        className={`group relative bg-gray-50 border border-gray-200
        rounded-lg overflow-hidden transition duration-200 ease-in-out
        hover:border-gray-300 hover:shadow-sm select-none cursor-pointer
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
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-10">
              <span className="text-[11px] font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">
                unavailable
              </span>
            </div>
          )}
          <div
            className="absolute top-2 right-2 w-9 h-9 rounded-full overflow-hidden
            flex items-center justify-center bg-gray-200/80 backdrop-blur-sm
            transition-opacity duration-200 ease-in-out z-10"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault()
              e.stopPropagation()
              if (isFavorite)
                removeFromFavorite()
              else
                addToFavorite()
            }}
          >
            {isFavorite ? (
              <IconStarFill size={16} color="gold" />
            ) : (
              <IconStar size={16} color="gold" />
            )}
          </div>
        </div>

        <div className="p-2 flex flex-col gap-1">
          <h3 className="text-[13px] font-medium text-black truncate">
            {allowance.name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            {allowance.duration && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-700">
                <IconSmallTimer size={12}/>
                {allowance.duration}min
              </span>
            )}
            {allowance.capacity && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-700">
                <IconSmallPerson size={12}/>
                {allowance.capacity}
              </span>
            )}
            {allowance.campus?.name && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-700">
                <IconSchool size={12}/>
                {allowance.campus.name}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}