import { getUser } from "@/actions"
import { Suspense } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ReservationSkeleton from "@/components/reservationSkeleton"
import ReservationsGrid from "@/components/reservationsGrid"

export default async function Reservations(): Promise<React.JSX.Element> {

  const user = await getUser()
  const token = user?.token

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <div className="flex flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-black font-medium">
              Your Reservations
            </span>
          </div>
          <div className="mt-1">

            <Suspense fallback={<ReservationSkeleton />}>
              <ReservationsGrid token={token} />
            </Suspense>

          </div>
        </div>

        <Footer />

      </main>
    </main>
  )
}