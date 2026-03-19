import { getAllowances } from "@/actions"
import type { Allowance } from "@/interfaces"
import Empty from "@/components/empty"
import AllowancesClientGrid from "@/components/allowancesClientGrid"

export default async function AllowancesGrid({
  serviceId,
  token
}: {
  serviceId: number
  token: string
}): Promise<React.JSX.Element> {

  const allowances: Allowance[] = await getAllowances(token, serviceId)

  if (allowances.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-black font-medium">
            Available Allocations
          </span>
          <span className="text-gray-400 text-[12px] select-none">
            0 option
          </span>
        </div>
        <Empty>
          No allocations available for this service<br/>
          Please check back later
        </Empty>
      </div>
    )
  }

  return (
    <div className="flex flex-col">

      <div className="flex items-center justify-between">
        <span className="text-black font-medium">
          Available Allocations
        </span>
        <span className="text-gray-400 text-[12px] select-none">
          {allowances.length} {allowances.length === 1 ? "option" : "options"}
        </span>
      </div>

      <AllowancesClientGrid
        allowances={allowances}
        serviceId={serviceId}
      />

    </div>
  )
}