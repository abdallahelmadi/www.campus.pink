"use client"

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

function getInitialFormState(): { email: string; password: string } {
  if (typeof window === "undefined") {
    return { email: "", password: "" }
  }
  const bc_token = JSON.parse(localStorage.getItem("bc_token") || "null")
  if (bc_token && bc_token?.email && bc_token?.password) {
    return { email: bc_token.email, password: bc_token.password }
  }
  return { email: "", password: "" }
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) &&
    (email.split("@")[1] === "um6p.ma" || email.split("@")[1] === "student.1337.ma")
}

const days = [
  "Sunday", "Monday",
  "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
]

const months = [
  "January", "February", "March",
  "April", "May", "June", "July", "August",
  "September", "October", "November", "December"
]

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr.replace(" ", "T"))
  const day = days[date.getDay()]
  const d = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${d} ${month} ${year}`
}

export {
  getFavoriteAllowances,
  addToFavoriteAllowance,
  removeFromFavoriteAllowance,
  getInitialFormState,
  validateEmail,
  formatDateLabel
}