import Header from "@/components/header"
import Footer from "@/components/footer"
import { getUser, getServices } from "@/actions"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import type { Service } from "@/interfaces"
import Breadcrumb from "@/components/breadcrumb"
import Image from "next/image"

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
    { revalidate: 1296000, tags: ["services"] }
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

        <div className="relative w-full h-92 rounded-lg overflow-hidden">
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
          <div className="absolute bottom-0 left-0 w-full px-3 py-2 flex items-center gap-3">
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
              <p className="text-white/70 text-[12px] line-clamp-6 leading-tight">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        ;

        <Footer />

      </main>
    </main>
  )
}






//         <div className="flex flex-col">
//           <div className="flex items-center justify-between">
//             <span className="text-black font-medium">
//               Available Allowances
//             </span>
//             <span className="text-gray-400 text-[12px]">
//               {allowances.length} {allowances.length === 1 ? "option" : "options"}
//             </span>
//           </div>

//           {allowances.length === 0 ? (
//             <Empty>
//               No allowances available for this service.<br />
//               Please check back later!
//             </Empty>
//           ) : (
//             <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
//               {allowances.map((allowance) => (
//                 <div
//                   key={allowance.id}
//                   className={`group relative bg-gray-50 border border-gray-200
//                   rounded-lg overflow-hidden transition duration-200 ease-in-out
//                   hover:border-gray-300 hover:shadow-sm
//                   ${allowance.enable !== 1 ? "opacity-50 pointer-events-none" : ""}`}
//                 >
//                   {/* Allowance Image */}
//                   {allowance.image && (
//                     <div className="relative w-full h-36 overflow-hidden">
//                       <Image
//                         src={allowance.image}
//                         alt={allowance.name ?? "Allowance"}
//                         fill
//                         draggable={false}
//                         quality={90}
//                         sizes="(max-width: 640px) 100vw, 50vw"
//                         className="object-cover object-center
//                         group-hover:scale-103 transition-transform duration-300 ease-in-out"
//                       />
//                       {allowance.enable !== 1 && (
//                         <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
//                           <span className="text-[11px] font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">
//                             Unavailable
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Allowance Details */}
//                   <div className="p-3 flex flex-col gap-2">
//                     <div className="flex items-start justify-between gap-2">
//                       <h3 className="text-[14px] font-medium text-black truncate">
//                         {allowance.name}
//                       </h3>
//                       {allowance.gender && (
//                         <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5
//                         rounded-full bg-gray-100 border border-gray-200 text-gray-500 uppercase tracking-wide">
//                           {allowance.gender}
//                         </span>
//                       )}
//                     </div>

//                     {allowance.description && (
//                       <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
//                         {allowance.description}
//                       </p>
//                     )}

//                     {/* Meta row */}
//                     <div className="flex items-center gap-3 flex-wrap">
//                       {allowance.duration && (
//                         <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
//                           <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
//                             <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
//                             <path d="M8 4.5V8L10.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                           {allowance.duration} min
//                         </span>
//                       )}
//                       {allowance.capacity && (
//                         <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
//                           <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
//                             <path d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z" stroke="currentColor" strokeWidth="1.5"/>
//                             <path d="M2 14C2 11.2386 4.68629 9 8 9C11.3137 9 14 11.2386 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//                           </svg>
//                           {allowance.capacity}
//                         </span>
//                       )}
//                       {allowance.campus?.name && (
//                         <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
//                           <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
//                             <path d="M8 1L1 5.5L8 10L15 5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
//                             <path d="M3 7V12L8 15L13 12V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
//                           </svg>
//                           {allowance.campus.name}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>