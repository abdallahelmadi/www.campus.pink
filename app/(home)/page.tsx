import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getServices } from "@/actions"
import ServicesCarousel from "@/components/servicesCarousel"
import Link from "next/link"
import { IconChevronRightSmall } from "@/icons"

export default async function Home(): Promise<React.JSX.Element> {

  const user = await getUser()
  const services = user ? await getServices(user.token) : []

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-5">

        <Header user={user} />

        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-black font-medium">
              Available Services
            </span>
            <Link
              href="/services"
              className="text-[#333] text-[12px] flex items-center gap-0.5
              transition duration-200 ease-in-out hover:text-black select-none"
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
                No services available at the moment<br/>
                Please check back later
              </Empty>
            ): (
              <ServicesCarousel services={services} />
            )}

          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-black font-medium mb-1">
            Clubs
          </span>
          <Empty>
            Comming Soon<br/>
            Explore and join various student clubs on campus to connect with like-minded individuals and pursue your interests
          </Empty>
        </div>

        <div className="flex flex-col">
          <span className="text-black font-medium mb-1">
            Upcoming Sports Events
          </span>
          <Empty>
            Comming Soon<br/>
            Find out when your department&apos;s team is playing next and cheer them on
          </Empty>
        </div>

        <div className="flex flex-col">
          <span className="text-black font-medium mb-1">
            Find Teammates
          </span>
          <Empty>
            Comming Soon<br/>
            Connect with fellow students to form sports teams, plan matches, and share your passion for sports on campus
          </Empty>
        </div>

        <Footer />

      </main>
    </main>
  )
}