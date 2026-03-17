import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getServices, getAllowances } from "@/actions"
import { unstable_cache } from "next/cache"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Service, Allowance } from "@/interfaces"
import { IconChevronRightSmall } from "@/icons"

export default async function ServiceById({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<React.JSX.Element> {

  const { id } = await params
  const serviceId = Number(id)

  if (isNaN(serviceId)) redirect("/")

  const user = await getUser()
  if (!user) redirect("/login")

  const getServicesCached = unstable_cache(
    async (token: string) => {
      return await getServices(token)
    },
    ["get-services"],
    { revalidate: 1296000, tags: ["services"] }
  )

  const services = await getServicesCached(user.token)
  const service: Service | undefined = services.find(s => s.id === serviceId)

  if (!service) redirect("/")

  const getAllowancesCached = unstable_cache(
    async (token: string, sid: number) => {
      return await getAllowances(token, sid)
    },
    [`get-allowances-${serviceId}`],
    { revalidate: 1296000, tags: [`allowances-${serviceId}`] }
  )

  const allowances: Allowance[] = await getAllowancesCached(user.token, serviceId)

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-5">

        <Header user={user} />

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-[12px] text-gray-400">
          <Link
            href="/"
            className="hover:text-black transition duration-200 ease-in-out"
          >
            Home
          </Link>
          <IconChevronRightSmall size={12} color="#9ca3af" />
          <Link
            href="/services"
            className="hover:text-black transition duration-200 ease-in-out"
          >
            Services
          </Link>
          <IconChevronRightSmall size={12} color="#9ca3af" />
          <span className="text-black font-medium truncate max-w-40">
            {service.name}
          </span>
        </nav>

        {/* Service Hero */}
        <div className="relative w-full h-52 sm:h-64 rounded-lg overflow-hidden">
          <Image
            src={service.cover!}
            alt={service.name ?? "Service cover"}
            fill
            draggable={false}
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 860px"
            className="object-cover object-center"
          />
          <div
            suppressHydrationWarning
            className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"
          />
          <div className="absolute bottom-0 left-0 w-full px-4 py-4 flex items-end gap-3">
            <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
              <Image
                src={service.logo!}
                alt={service.name ?? "Service logo"}
                width={56}
                height={56}
                draggable={false}
                quality={100}
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h1 className="text-white text-lg font-bold truncate">
                {service.name}
              </h1>
              <p className="text-white/70 text-[12px] line-clamp-2 leading-tight">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Allowances Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-black font-medium">
              Available Allowances
            </span>
            <span className="text-gray-400 text-[12px]">
              {allowances.length} {allowances.length === 1 ? "option" : "options"}
            </span>
          </div>

          {allowances.length === 0 ? (
            <Empty className="mt-2">
              No allowances available for this service.<br />
              Please check back later!
            </Empty>
          ) : (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allowances.map((allowance) => (
                <div
                  key={allowance.id}
                  className={`group relative bg-gray-50 border border-gray-200
                  rounded-lg overflow-hidden transition duration-200 ease-in-out
                  hover:border-gray-300 hover:shadow-sm
                  ${allowance.enable !== 1 ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {/* Allowance Image */}
                  {allowance.image && (
                    <div className="relative w-full h-36 overflow-hidden">
                      <Image
                        src={allowance.image}
                        alt={allowance.name ?? "Allowance"}
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
                  )}

                  {/* Allowance Details */}
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

                    {allowance.description && (
                      <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
                        {allowance.description}
                      </p>
                    )}

                    {/* Meta row */}
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
              ))}
            </div>
          )}
        </div>

        <Footer />

      </main>
    </main>
  )
}
