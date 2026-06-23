import { Suspense } from "react"
import Footer from "@/components/footer"
import Header from "@/components/header"
import ReservationSkeleton from "@/components/reservationSkeleton"
import ReservationsGrid from "@/components/reservationsGrid"

export default function Reservations(): React.JSX.Element {
  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header />

        <div className="flex flex-col">
          <Suspense fallback={<ReservationSkeleton />}>
            <ReservationsGrid />
          </Suspense>
        </div>

        <Footer />

      </main>
    </main>
  )
}