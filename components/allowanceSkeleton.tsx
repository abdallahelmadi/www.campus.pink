import Skeleton from "@/components/skeleton"

export default function AllowanceSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col">

      <div className="flex items-center justify-between">
        <span className="text-black font-medium">
          Available Allocations
        </span>
        <Skeleton className="rounded-md! w-21! h-5!"/>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {Array.from({ length: 11 }).map((_, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-lg overflow-hidden"
          >
            <Skeleton className="w-full! h-36! overflow-hidden!"/>
            <div className="p-2 flex flex-col gap-1">
              <Skeleton className="rounded-md! w-27! h-4!"/>
              <div className="flex items-center gap-3 flex-wrap">
                <Skeleton className="rounded-md! w-12.5! h-4!"/>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}