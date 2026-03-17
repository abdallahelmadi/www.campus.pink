import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getServices } from "@/actions"
import { unstable_cache } from "next/cache"
import ServiceCard from "@/components/serviceCard"
import Breadcrumb from "@/components/breadcrumb"

export default async function Services(): Promise<React.JSX.Element> {

  const user = await getUser()

  const getServicesCached = unstable_cache(
    async (token: string) => {
      return await getServices(token)
    },
    ["get-services"],
    { revalidate: 1296000, tags: ["services"] }
  )

  const services = user ? await getServicesCached(user.token) : []

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <div className="flex flex-col">

          <Breadcrumb
            elements={[
              { href: "/services", label: "Services" }
            ]}
          />

          <span className="text-black font-medium">
            All Available Services
          </span>

          <div className="mt-1"/>

          { services.length === 0 ? (
            <Empty >
              No services available at the moment.<br/>
              Please check back later!
            </Empty>
          ): (
            <div className="mt-1 grid grid-cols-1 min-[1122px]:grid-cols-2 gap-2">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  longDescription
                  className="h-80!"
                />
              ))}
            </div>
          )}

        </div>

        <Footer />

      </main>
    </main>
  )
}