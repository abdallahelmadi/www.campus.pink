"use client"
import type { Service } from "@/interfaces"
import useEmblaCarousel from "embla-carousel-react"
import ServiceCard from "@/components/serviceCard"

export default function ServicesCarousel({
  services
}: {
  services: Service[]
}): React.JSX.Element {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: false
  })
  return (
    <div
      className="relative w-full overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex w-full h-full gap-2">
        {services.map((s: Service) => (
          <ServiceCard service={s} key={s.id} />
        ))}
      </div>
    </div>
  )
}