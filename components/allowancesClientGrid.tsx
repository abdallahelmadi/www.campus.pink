"use client"
import type { Allowance } from "@/interfaces"
import AllowanceCard from "@/components/allowanceCard"
import { useState } from "react"
import Footer from "@/components/footer"
import { getFavoriteAllowances, addToFavoriteAllowance, removeFromFavoriteAllowance } from "@/utils/client"

export default function AllowancesClientGrid({
  allowances,
  serviceId
}: {
  allowances: Allowance[]
  serviceId: number
}): React.JSX.Element {

  const [forceUpdate, setForceUpdate] = useState<boolean>(false)
  const favorites = getFavoriteAllowances()
  if (favorites === undefined) return <></>

  const sortedAllowances = [...allowances].sort((a, b) => {
    const serviceFavorites = favorites?.find(f => f.serviceId === serviceId)?.favorites ?? []
    const aIsFavorite = serviceFavorites.includes(a.id)
    const bIsFavorite = serviceFavorites.includes(b.id)

    if (aIsFavorite && !bIsFavorite) return -1
    if (!aIsFavorite && bIsFavorite) return 1
    return 0
  })

  return (
    <div className="flex flex-col">
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sortedAllowances.map(allowance => (
          <AllowanceCard
          allowance={allowance}
          serviceId={serviceId}
          key={allowance.id}
          removeFromFavorite={() => {
            removeFromFavoriteAllowance(serviceId, allowance.id)
            setForceUpdate(!forceUpdate)
          }}
          addToFavorite={() => {
            addToFavoriteAllowance(serviceId, allowance.id)
            setForceUpdate(!forceUpdate)
          }}
          isFavorite={favorites?.find(f => f.serviceId === serviceId)?.favorites.includes(allowance.id) ?? false}
          />
        ))}
      </div>
      <Footer />
    </div>
  )
}