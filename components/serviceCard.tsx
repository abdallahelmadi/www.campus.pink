import type { Service } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"

export default function ServiceCard({
  service,
  className = "",
  longDescription = false
}: {
  service: Service
  className?: string
  longDescription?: boolean
}): React.JSX.Element {
  return (
    <Link
      href={`/services/${service.id}`}
      className={`bg-gray-100 h-70 min-w-135
      overflow-hidden rounded-sm relative shrink-0 group select-none
      max-sm:min-w-[96%] ${className}`}
    >

      <Image
        src={service.cover!}
        alt=""
        fill
        draggable={false}
        loading="eager"
        priority
        quality={100}
        suppressHydrationWarning
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center absolute inset-0 outline-none z-0
        group-hover:scale-103 transition-transform duration-300 ease-in-out"
      />

      <div
        suppressHydrationWarning
        className="absolute left-0 bottom-0 w-full h-1/3
        bg-linear-to-t from-black/60 to-transparent"
      />

      <div
        suppressHydrationWarning
        className="absolute left-0 bottom-0 px-3 py-2
        max-w-full min-w-full flex gap-2 flex-col"
      >
        <div className="flex items-center gap-2">
          <Image
            src={service.logo!}
            alt=""
            width={38}
            height={38}
            draggable={false}
            quality={100}
            className="rounded-full object-cover object-center"
          />
          <h2 className="text-[15px] text-white font-medium truncate">
            {service.name}
          </h2>
        </div>
        <div
          className={`${longDescription ? "line-clamp-3" : "line-clamp-2"}
          wrap-break-word text-white/70 text-[12px] leading-tight`}
        >
          {service.description}
        </div>
      </div>

    </Link>
  )
}