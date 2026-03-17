import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getServices } from "@/actions"
import ServicesCarousel from "@/components/servicesCarousel"
import { unstable_cache } from "next/cache"
import Link from "next/link"
import { IconChevronRightSmall } from "@/icons"

export default async function Home(): Promise<React.JSX.Element> {

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
      <main className="max-w-340 w-full flex flex-col gap-5">

        <Header user={user} />

        <div className="flex flex-col">
          <span className="flex items-center text-[15px]">
            Hello <b className="font-bold text-black ml-2"> {user?.name} </b>,
          </span>
          <div className="flex items-center justify-between w-full">
            <span className="text-black font-medium">
              Available Services
            </span>
            <Link
              href="/services"
              className="text-[#333] text-[12px] flex items-center gap-0.5
              transition duration-200 ease-in-out hover:text-black"
            >
              View All
              <span className="-mt-px">
                <IconChevronRightSmall size={12} />
              </span>
            </Link>
          </div>
          <div className="mt-1">

            { services.length === 0 ? (
              <Empty>
                No services available at the moment.<br/>
                Please check back later!
              </Empty>
            ): (
              <ServicesCarousel services={services} />
            )}

          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-black font-medium mb-1">
            Upcoming Sports Events
          </span>
          <Empty>
            Comming Soon!
          </Empty>
        </div>

        <div className="flex flex-col">
          <span className="text-black font-medium mb-1">
            Find Teammates
          </span>
          <Empty>
            Comming Soon!
          </Empty>
        </div>

        <Footer />

      </main>
    </main>
  )
}