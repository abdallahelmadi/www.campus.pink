import Skeleton from "@/components/skeleton"

export default function SlotsSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out]">
      {Array.from({ length: 13 }).map((_, index) => {
        return (
          <div key={index}>
            <button className="w-full text-left rounded-xl border p-3.5 bg-white border-gray-200">
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="w-10! h-10! rounded-lg!"/>
                  <div className="flex flex-col min-w-0">
                    <Skeleton className="w-19! h-4!"/>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Skeleton className="w-13! h-3!"/>
                      <Skeleton className="w-12! h-1.5! rounded-full!"/>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Skeleton className="w-18! h-5.25! rounded-full!"/>
                  <Skeleton className="w-6! h-6! rounded-full!"/>
                </div>

              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}