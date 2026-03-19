import Header from "@/components/header"
import { getUser, getAllowances, getServices } from "@/actions"
import { notFound } from "next/navigation"
import type { Allowance } from "@/interfaces"
import Breadcrumb from "@/components/breadcrumb"

export default async function ServiceById({
  params
}: {
  params: Promise<{ service_id: string; allowance_id: string }>
}): Promise<React.JSX.Element> {

  const { service_id, allowance_id } = await params
  const serviceId = Number(service_id)
  const allowanceId = Number(allowance_id)

  if (isNaN(serviceId)) notFound()
  if (isNaN(allowanceId)) notFound()

  const user = await getUser()
  if (!user) notFound()

  const services = await getServices(user.token)
  const service = services.find(s => s.id === serviceId)
  if (!service) notFound()

  const allowances: Allowance[] = await getAllowances(user.token, serviceId)
  const allowance = allowances.find(a => a.id === allowanceId)
  if (!allowance) notFound()

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">
    
        <Header user={user} />

        <Breadcrumb
          elements={[
            { href: "/services", label: "Services" },
            { href: `/services/${serviceId}`, label: "..." },
            { href: `/services/${serviceId}/${allowanceId}`, label: allowance.name || "allocation" }
          ]}
        />
      
      </main>
    </main>
  )
}