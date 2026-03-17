import { getAllowances } from "@/actions"
import type { Allowance } from "@/interfaces"
import { unstable_cache } from "next/cache"

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
    { revalidate: 1296000, tags: [`allowances-${serviceId}`] }
  )

  const allowances: Allowance[] = await getAllowancesCached(token, serviceId)

  return (
    <></>
  )
}