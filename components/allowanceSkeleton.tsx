import Skeleton from "@/components/skeleton"

export default function AllowanceSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col">

      <div className="flex items-center justify-between">
        <span className="text-black font-medium">
          Available Allocations
        </span>
        <Skeleton className="rounded-md! w-25! h-5!"/>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full! h-[252.5px] rounded-lg!"
          />
        ))}
      </div>

    </div>
  )
}