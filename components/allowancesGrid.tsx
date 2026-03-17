import { getAllowances } from "@/actions"
import type { Allowance } from "@/interfaces"
import { unstable_cache } from "next/cache"
import AllowanceCard from "@/components/allowanceCard"
import Empty from "@/components/empty"

export default async function AllowancesGrid({
  serviceId,
  token
}: {
  serviceId: number
  token: string
}): Promise<React.JSX.Element> {

  const getAllowancesCached = unstable_cache(
    async (token: string, sid: number) => {
      return await getAllowances(token, sid)
    },
    [`get-allowances-${serviceId}`],
    { revalidate: 2592000, tags: [`allowances-${serviceId}`] }
  )

  const allowances: Allowance[] = await getAllowancesCached(token, serviceId)

  if (allowances.length === 0) {
    return (
      <Empty>
        No allocations available for this service.<br/>
        Please check back later!
      </Empty>
    )
  }

  return (
    <div className="flex flex-col">

      <div className="flex items-center justify-between">
        <span className="text-black font-medium">
          Available Allocations
        </span>
        <span className="text-gray-400 text-[12px]">
          {allowances.length} {allowances.length === 1 ? "option" : "options"}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {allowances.map(allowance => (
          <AllowanceCard
            allowance={allowance}
            key={allowance.id}
          />
        ))}
      </div>

    </div>
  )
}