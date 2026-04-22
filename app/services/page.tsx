import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getServices } from "@/actions"
import ServiceCard from "@/components/serviceCard"
import Breadcrumb from "@/components/breadcrumb"

export default async function Services(): Promise<React.JSX.Element> {

  const user = await getUser()
  const services = user ? await getServices(user.token, user.campus.id) : []

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

          <div className="mt-2"/>

          <span className="text-black font-medium">
            All Available Services
          </span>

          <div className="mt-1"/>

          { services.length === 0 ? (
            <Empty>
              No services available at the moment<br/>
              Please check back later
            </Empty>
          ): (
            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {services.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  longDescription
                  className="h-80! min-w-full! max-sm:min-w-full!"
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