"use client"
import type { TimeSlote } from "@/interfaces"

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

function getStatusLabel(slot: TimeSlote, selectedDate?: string): { text: string; style: string } {
  if (slot.start && selectedDate) {
    const [year, month, day] = selectedDate.split("-").map(Number)
    const [hours, minutes] = slot.start.split(":").map(Number)
    const slotDateTime = new Date(year, month - 1, day, hours, minutes, 0)
    if (slotDateTime <= new Date()) return { text: "Passed", style: "bg-gray-100 text-gray-500 border-gray-200" }
  }
  if (slot.isMaintenance) return { text: "Maintenance", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (slot.isPause) return { text: "Break", style: "bg-gray-100 text-gray-500 border-gray-200" }
  if (slot.waitingList) return { text: "Waiting List", style: "bg-amber-50 text-amber-600 border-amber-200" }
  if (slot.canBook) return { text: "Available", style: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  return { text: "Full", style: "bg-red-50 text-red-600 border-red-200" }
}

export {
  getFavoriteAllowances,
  addToFavoriteAllowance,
  removeFromFavoriteAllowance,
  getInitialFormState,
  validateEmail,
  formatDateLabel,
  getStatusLabel
}