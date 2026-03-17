"use client"
import { IconSchool, IconSmallPerson, IconSmallTimer } from "@/icons"
import type { Allowance } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"

export default function AllowanceCard({
  allowance,
  serviceId
}: {
  allowance: Allowance
  serviceId: number
}): React.JSX.Element {
  return (
    <Link href={`/services/${serviceId}/${allowance.id}`}>
      <div
        className={`group relative bg-gray-50 border border-gray-200
        rounded-lg overflow-hidden transition duration-200 ease-in-out
        hover:border-gray-300 hover:shadow-sm select-none cursor-pointer
        ${allowance.enable !== 1 ? "opacity-50 pointer-events-none" : ""}
        md:min-h-[252.5px]`}
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
          <span
            className="shrink-0 text-[10px] font-medium px-1.5 py-0.5
            rounded-full bg-gray-100 border border-gray-200 text-gray-500 uppercase tracking-wide"
          >
            {allowance.gender === "m" ? "Male" : allowance.gender === "f" ? "Female" : "Male & Female"}
          </span>
        </div>

        <p className="text-[12px] text-gray-500 leading-tight line-clamp-2">
          {allowance.description}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {allowance.duration && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-700">
              <IconSmallTimer size={12}/>
              {allowance.duration} min
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