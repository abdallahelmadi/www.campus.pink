import Header from "@/components/header"
import Footer from "@/components/footer"
import { getUser, getServices } from "@/actions"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import type { Service } from "@/interfaces"
import Breadcrumb from "@/components/breadcrumb"
import Image from "next/image"
import AllowancesGrid from "@/components/allowancesGrid"
import { Suspense } from "react"
import AllowanceSkeleton from "@/components/allowanceSkeleton"

export default async function ServiceById({
  params
}: {
  params: Promise<{ service_id: string }>
}): Promise<React.JSX.Element> {

  const { service_id } = await params
  const serviceId = Number(service_id)

  if (isNaN(serviceId)) notFound()

  const user = await getUser()
  if (!user) notFound()

  const getServicesCached = unstable_cache(
    async (token: string) => {
      return await getServices(token)
    },
    ["get-services"],
    { revalidate: 2592000, tags: ["services"] }
  )

  const services = await getServicesCached(user.token)
  const service: Service | undefined = services.find(s => s.id === serviceId)

  if (!service) notFound()

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <Breadcrumb
          elements={[
            { href: "/services", label: "Services" },
            { href: `/services/${serviceId}`, label: service.name || "service" }
          ]}
        />

        <div className="mt-2"/>

        <div className="relative w-full h-92 rounded-lg overflow-hidden select-none mb-3">
          <Image
            src={service.cover!}
            alt=""
            fill
            draggable={false}
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 860px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"/>
          <div
            className={`absolute bottom-0 left-0 w-full px-3 py-2 flex gap-3
            ${!service.description ? "items-center" : "items-start"}`}
          >
            <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <Image
                src={service.logo!}
                alt=""
                width={46}
                height={46}
                draggable={false}
                quality={100}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h1 className="text-white text-[16px] font-bold truncate">
                {service.name}
              </h1>
              <p className="text-white/70 text-[12px] line-clamp-4 leading-tight">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<AllowanceSkeleton />}>
          <AllowancesGrid
            serviceId={serviceId}
            token={user.token}
          />
        </Suspense>

        <Footer />

      </main>
    </main>
  )
}