import Header from "@/components/header"
import { getUser, getAllowances, getServices, getHolidays } from "@/actions"
import { notFound, redirect } from "next/navigation"
import type { Allowance } from "@/interfaces"
import Breadcrumb from "@/components/breadcrumb"
import GlobalMakeReservationComponent from "@/components/globalMakeReservationComponent"
import { generateNext15Days } from "@/utils/client"
import Footer from "@/components/footer"

export default async function Reservation({
  params,
  searchParams
}: {
  params: Promise<{ service_id: string; allowance_id: string }>
  searchParams: Promise<{ date?: string }>
}): Promise<React.JSX.Element> {

  const { service_id, allowance_id } = await params
  const { date } = await searchParams
  const serviceId = Number(service_id)
  const allowanceId = Number(allowance_id)

  if (isNaN(serviceId)) notFound()
  if (isNaN(allowanceId)) notFound()

  const user = await getUser()
  if (!user) redirect("/login")

  const [services, allowances, holidays] = await Promise.all([
    getServices(user.token),
    getAllowances(user.token, serviceId),
    getHolidays(user.token)
  ])

  const service = services.find(s => s.id === serviceId)
  if (!service) notFound()

  const allowance: Allowance | undefined = allowances.find(a => a.id === allowanceId)
  if (!allowance) notFound()

  const days = generateNext15Days()
  const selectedDate = date && days.some(d => d.date === date) ? date : days[0].date

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <Breadcrumb
          elements={[
            { href: "/services", label: "Services" },
            { href: `/services/${serviceId}`, label: "..." },
            { href: `/services/${serviceId}/${allowanceId}`, label: allowance.name || "Allowance" }
          ]}
        />

        <div className="mt-2" />

        <GlobalMakeReservationComponent
          token={user.token}
          allowance={allowance}
          serviceId={serviceId}
          allowanceId={allowanceId}
          holidays={holidays}
          selectedDate={selectedDate}
          days={days}
        />

        <Footer />

      </main>
    </main>
  )
}