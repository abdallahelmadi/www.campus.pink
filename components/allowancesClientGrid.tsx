"use client"
import type { Allowance } from "@/interfaces"
import AllowanceCard from "@/components/allowanceCard"
import { useState, useEffect } from "react"

function getFavoriteAllowances(): {
  serviceId: number
  favorites: number[]
}[] | undefined | null {
  try {
    if (typeof window === "undefined")
      return undefined
    const bc_favorites = JSON.parse(localStorage.getItem("bc_favorites") || "null")
    if (Array.isArray(bc_favorites) && bc_favorites.every(a => a.serviceId && Array.isArray(a.favorites))) {
      return bc_favorites as { serviceId: number; favorites: number[] }[]
    }
    return null
  } catch {
    return null
  }
}

function addToFavoriteAllowance(serviceId: number, allowanceId: number): void {
  try {
    const favorites = getFavoriteAllowances() ?? []
    const serviceFavorites = favorites.find(f => f.serviceId === serviceId) ?? { serviceId, favorites: [] }
    if (!serviceFavorites.favorites.includes(allowanceId)) {
      serviceFavorites.favorites.push(allowanceId)
      if (!favorites.some(f => f.serviceId === serviceId)) {
        favorites.push(serviceFavorites)
      }
      localStorage.setItem("bc_favorites", JSON.stringify(favorites))
    }
  } catch {}
}

function removeFromFavoriteAllowance(serviceId: number, allowanceId: number): void {
  try {
    const favorites = getFavoriteAllowances() ?? []
    const serviceFavorites = favorites.find(f => f.serviceId === serviceId)
    if (serviceFavorites) {
      serviceFavorites.favorites = serviceFavorites.favorites.filter(id => id !== allowanceId)
      if (serviceFavorites.favorites.length === 0) {
        const index = favorites.findIndex(f => f.serviceId === serviceId)
        if (index !== -1) {
          favorites.splice(index, 1)
        }
      }
      localStorage.setItem("bc_favorites", JSON.stringify(favorites))
    }
  } catch {}
}

export default function AllowancesClientGrid({
  allowances,
  serviceId
}: {
  allowances: Allowance[]
  serviceId: number
}): React.JSX.Element {

  const [favorites, setFavorites] = useState<{ serviceId: number; favorites: number[] }[] | undefined | null>(null)
  const [_, setForceUpdate] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFavorites(getFavoriteAllowances())
    }, 200)
    return () => clearTimeout(timer)
  }, [])

  const sortedAllowances = [...allowances].sort((a, b) => {
    const serviceFavorites = favorites?.find(f => f.serviceId === serviceId)?.favorites ?? []
    const aIsFavorite = serviceFavorites.includes(a.id)
    const bIsFavorite = serviceFavorites.includes(b.id)

    if (aIsFavorite && !bIsFavorite) return -1
    if (!aIsFavorite && bIsFavorite) return 1
    return 0
  })

  return (
    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {sortedAllowances.map(allowance => (
        <AllowanceCard
          allowance={allowance}
          serviceId={serviceId}
          key={allowance.id}
          removeFromFavorite={() => {
            removeFromFavoriteAllowance(serviceId, allowance.id)
            setForceUpdate(prev => !prev)
          }}
          addToFavorite={() => {
            addToFavoriteAllowance(serviceId, allowance.id)
            setForceUpdate(prev => !prev)
          }}
          isFavorite={favorites?.find(f => f.serviceId === serviceId)?.favorites.includes(allowance.id) ?? false}
        />
      ))}
    </div>
  )
}