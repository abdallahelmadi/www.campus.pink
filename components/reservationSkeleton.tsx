import Skeleton from "@/components/skeleton"

export default function ReservationSkeleton(): React.JSX.Element {
  return (
    <main className="w-full flex flex-col gap-4">

      <Skeleton className="h-10! p-1! shadow-[0_0_0_1px_#00000014]! rounded-md! !w-[177.5]!"/>

      {[2, 1, 3].map(group => (
        <div key={group} className="flex flex-col gap-2">
          <Skeleton className="w-36! h-4.75! rounded-sm! px-1"/>
          <div
            suppressHydrationWarning
            className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-340
            lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >

            {[...Array(group)].map((_, card) => (
              <div key={card}>
                <Skeleton className="min-w-full! h-42! rounded-none! border border-gray-200"/>
                <div className="flex justify-between mt-1 min-h-11 items-center">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 mt-0.75">
                      <Skeleton className="w-2.75! h-2.75! rounded-[5px]! border border-gray-200"/>
                      <Skeleton className="w-15! h-2.5! rounded-[50px]!"/>
                    </div>
                    <Skeleton className="w-14! h-5.5! rounded-[50px]! mt-1 border border-gray-200"/>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-23.25! h-9! rounded-full!"/>
                    <Skeleton className="w-9! h-9! rounded-full!"/>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      ))}

    </main>
  )
}