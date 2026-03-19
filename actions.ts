"use server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import type {
  Service,
  Points,
  Allowance,
  Holiday,
  TimeSlote,
  Reservation,
  User
} from "@/interfaces"
import { unstable_cache, updateTag } from "next/cache"

async function updateToken(token: string): Promise<void> {
  (await cookies()).set("t", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30
  })
}

async function clearToken(): Promise<void> {
  (await cookies()).set("t", "", {
    httpOnly: true,
    secure: true,
    maxAge: 0
  })
}

async function getUser(): Promise<User | undefined> {
  try {

    const t = (await cookies()).get("t")?.value
    if (!t) return undefined

    const decoded = jwt.verify(t, process.env.JWT_SECRET!) as {
      exp?: number
      token?: string
      name?: string
      email?: string
      gender?: string
      phone?: string
      campus: {
        id?: number
        name?: string
      }
    } | null

    if (!decoded) return undefined
    if (!decoded?.exp) return undefined
    if (!decoded?.token) return undefined

    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp < now) return undefined

    const decodedApiToken = jwt.decode(decoded.token) as {
      exp?: number
    } | null

    if (!decodedApiToken?.exp) return undefined
    if (decodedApiToken.exp < now) return undefined

    return decoded as User
  } catch {
    return undefined
  }
}

async function userLogin(email: string, password: string): Promise<boolean> {
  try {

    const res = await fetch(`https://${process.env.API_HOST!}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password
      })
    })

    if (res.ok) {
      const data = await res.json() as {
        token?: string
        user?: User
      }

      if (!data?.token || !data?.user) return false

      const decodedToken = jwt.decode(data.token) as {
        exp?: number
      } | null

      if (!decodedToken?.exp) return false

      const payload = {
        token: data.token,
        name: data.user?.name,
        email: data.user?.email,
        phone: data.user?.phone,
        gender: data.user?.gender,
        campus: {
          id: data.user?.campus?.id,
          name: data.user?.campus?.name
        },
        exp: decodedToken?.exp
      }

      const signedToken = jwt.sign(payload, process.env.JWT_SECRET!)
      await updateToken(signedToken)
      return true
    }

    return false
  } catch {
    return false
  }
}

const getServices = unstable_cache(
  async (token: string): Promise<Service[]> => {
    try {

      const res = await fetch(`https://${process.env.API_HOST!}/api/service/list?page=1`, {
        method: "POST",
        headers: { "Authorization": `bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json() as {
          data?: Service[]
          last_page?: number
        }

        if (!Array.isArray(data?.data) || data.data.length === 0) return []

        const services: Service[] = data.data.map<Service>((ele: Service) => ({
          id: ele.id,
          name: ele.name,
          description: ele.description,
          logo: "https://" + process.env.STORAGE_HOST! + "/" + ele.logo?.replace(/\.\w+$/, ".webp"),
          cover: "https://" + process.env.STORAGE_HOST! + "/" + ele.cover?.replace(/\.\w+$/, ".webp")
        }))

        if (data?.last_page && data.last_page > 1) {
          const fetches = Array.from({ length: data.last_page - 1 }, (_, i) => {
            const page = i + 2
            return fetch(`https://${process.env.API_HOST!}/api/service/list?page=${page}`, {
              method: "POST",
              headers: { "Authorization": `bearer ${token}` }
            }).then(r => r.json())
          })

          const jsons: {
            data?: Service[]
          }[] = await Promise.all(fetches)

          services.push(
            ...jsons.flatMap(pageData =>
              Array.isArray(pageData?.data)
              ? pageData.data.map<Service>(ele => ({
                  id: ele.id,
                  name: ele.name,
                  description: ele.description,
                  logo: "https://" + process.env.STORAGE_HOST! + "/" + ele.logo?.replace(/\.\w+$/, ".webp"),
                  cover: "https://" + process.env.STORAGE_HOST! + "/" + ele.cover?.replace(/\.\w+$/, ".webp")
                }))
              : []
            )
          )
        }

        return services
      }

      return []
    } catch {
      return []
    }
  },
  ["get-services"],
  { revalidate: 2592000, tags: ["services"] }
)

async function clearServicesCache(): Promise<void> {
  updateTag("services")
}

const getPoints = unstable_cache(
  async (token: string): Promise<Points | undefined> => {
    try {

      const res = await fetch(`https://${process.env.API_HOST!}/api/mypoints`, {
        method: "POST",
        headers: { "Authorization": `bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json() as {
          points?: number
          tombola?: boolean
          tombola_points?: number
          rank?: number
          status?: string
        }
        if (data?.status) return undefined
        return data as Points
      }

      return undefined
    } catch {
      return undefined
    }
  },
  ["get-points"],
  { revalidate: 86400, tags: ["points"] }
)

async function clearPointsCache(): Promise<void> {
  updateTag("points")
}

async function getAllowances(token: string, id: number): Promise<Allowance[]> {
  const c = unstable_cache(
    async (): Promise<Allowance[]> => {
      try {

        const res = await fetch(`https://${process.env.API_HOST!}/api/prestation/list?service_id=${id}&page=1`, {
          method: "POST",
          headers: { "Authorization": `bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json() as {
            data?: Allowance[]
            last_page?: number
          }

          if (!Array.isArray(data?.data) || data?.data.length === 0) return []

          const allowances: Allowance[] = data.data.map<Allowance>(ele => ({
            id: ele.id,
            name: ele.name,
            capacity: ele.capacity,
            image: "https://" + process.env.STORAGE_HOST! + "/" + ele.image?.replace(/\.\w+$/, ".webp"),
            description: ele.description,
            duration: ele.duration,
            gender: ele.gender,
            enable: ele.enable,
            campus: {
              name: ele.campus.name
            }
          }))

          if (data?.last_page && data.last_page > 1) {
            const fetches = Array.from({ length: data.last_page - 1 }, (_, i) => {
              const page = i + 2
              return fetch(`https://${process.env.API_HOST!}/api/prestation/list?service_id=${id}&page=${page}`, {
                method: "POST",
                headers: { "Authorization": `bearer ${token}` }
              }).then(r => r.json())
            })

            const jsons: {
              data?: Allowance[]
            }[] = await Promise.all(fetches)

            allowances.push(
              ...jsons.flatMap(pageData =>
                Array.isArray(pageData?.data)
                ? pageData.data.map<Allowance>(ele => ({
                    id: ele.id,
                    name: ele.name,
                    capacity: ele.capacity,
                    image: "https://" + process.env.STORAGE_HOST! + "/" + ele.image?.replace(/\.\w+$/, ".webp"),
                    description: ele.description,
                    duration: ele.duration,
                    gender: ele.gender,
                    enable: ele.enable,
                    campus: {
                      name: ele.campus.name
                    }
                  }))
                : []
              )
            )
          }

          return allowances
        }

        return []
      } catch {
        return []
      }
    },
    [`get-allowances-${id}`],
    { revalidate: 2592000, tags: [`allowances-${id}`] }
  )
  return c()
}

async function clearAllowancesCache(id: number): Promise<void> {
  updateTag(`allowances-${id}`)
}

const getHolidays = unstable_cache(
  async (token: string): Promise<Holiday[]> => {
    try {

      const res = await fetch(`https://${process.env.API_HOST!}/api/holiday/list`, {
        method: "POST",
        headers: { "Authorization": `bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json() as {
          description?: string
          isOff?: string
          date?: string
          event?: string
          status?: string
        }
        if (data?.status) return []
        return data as Holiday[]
      }

      return []
    } catch {
      return []
    }
  },
  ["get-holidays"],
  { revalidate: 300, tags: ["holidays"] }
)

async function clearHolidaysCache(): Promise<void> {
  updateTag("holidays")
}

async function getTimeSlotes(
  token: string,
  allowance: number,
  date: string
): Promise<TimeSlote[]> {
  try {

    const res = await fetch(`https://${process.env.API_HOST!}/api/prestation/timeslotes/${allowance}?page=1&date_start=${date}&date_end=${date}`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` }
    })

    if (res.ok) {
      const data = await res.json() as {
        data?: {
          id: number
          time_start: string
          time_end: string
          capacity: string
          canbook: boolean
          approuved: number
          is_pause: boolean
          is_maintenance: boolean
          number: number
          waiting_list: boolean
        }[]
        to?: number
      }

      if (!Array.isArray(data?.data) || data.data.length === 0) return []

      const slots: TimeSlote[] = data.data.map<TimeSlote>((ele: {
        id: number
        time_start: string
        time_end: string
        capacity: string
        canbook: boolean
        approuved: number
        is_pause: boolean
        is_maintenance: boolean
        number: number
        waiting_list: boolean
      }) => ({
        id: ele.id,
        start: ele.time_start,
        end: ele.time_end,
        capacity: Number(ele.capacity),
        reserved: ele.number,
        present: ele.approuved,
        canBook: ele.canbook,
        isPause: ele.is_pause,
        isMaintenance: ele.is_maintenance,
        waitingList: ele.waiting_list
      }))

      if (data?.to && data.to > 1) {
        const fetches = Array.from({ length: data.to - 1 }, (_, i) => {
          const page = i + 2
          return fetch(`https://${process.env.API_HOST!}/api/prestation/timeslotes/${allowance}?page=${page}&date_start=${date}&date_end=${date}`, {
            method: "POST",
            headers: { "Authorization": `bearer ${token}` }
          }).then(r => r.json())
        })

        const jsons: {
          data?: {
            id: number
            time_start: string
            time_end: string
            capacity: string
            canbook: boolean
            approuved: number
            is_pause: boolean
            is_maintenance: boolean
            number: number
            waiting_list: boolean
          }[]
        }[] = await Promise.all(fetches)

        slots.push(
          ...jsons.flatMap(pageData =>
            Array.isArray(pageData?.data)
            ? pageData.data.map<TimeSlote>(ele => ({
                id: ele.id,
                start: ele.time_start,
                end: ele.time_end,
                capacity: Number(ele.capacity),
                reserved: ele.number,
                present: ele.approuved,
                canBook: ele.canbook,
                isPause: ele.is_pause,
                isMaintenance: ele.is_maintenance,
                waitingList: ele.waiting_list
              }))
            : []
          )
        )
      }

      return slots
    }

    return []
  } catch {
    return []
  }
}

async function makeReservation(
  token: string,
  allowance: number,
  date: string,
  timeslot: number
): Promise<{
  success: boolean
  message: string
}> {
  try {

    const formData = new FormData()

    formData.append("prestation_id", String(allowance))
    formData.append("date_start", date)
    formData.append("date_end", date)
    formData.append("timeslote_id", String(timeslot))

    const res = await fetch(`https://${process.env.API_HOST!}/api/appointment`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` },
      body: formData
    })

    if (!res.ok) return { success: false, message: "Failed to make reservation, please try again later" }

    const data: {
      success?: boolean
      message?: string
      status?: string
    } = await res.json()

    if (data?.status) return {
      success: false,
      message: "Failed to make reservation, please try again later"
    }

    await clearPointsCache()
    await clearReservationsCache()

    return data as { success: boolean; message: string }
  } catch {
    return { success: false, message: "Failed to make reservation, please try again later" }
  }
}

const getReservations = unstable_cache(
  async ( token: string, page: number): Promise<Reservation[]> => {
    try {

      const res = await fetch(`https://${process.env.API_HOST!}/api/appointment/list?page=${page}`, {
        method: "POST",
        headers: { "Authorization": `bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json() as {
          data?: {
            _id: string
            date_start: string
            date_end: string
            code_qr: string
            status: number
            prestation: {
              name: string
              image: string
              description: string
            }
          }[]
        }

        if (!Array.isArray(data?.data) || data?.data.length === 0) return []

        return data.data.map<Reservation>((ele: {
          _id: string
          date_start: string
          date_end: string
          code_qr: string
          status: number
          prestation: {
            name: string
            image: string
            description: string
          }
        }) => ({
          id: ele._id,
          start: ele.date_start,
          end: ele.date_end,
          qrCode: ele.code_qr,
          status: ele.status === 1 ? "approved" : ele.status === 3 ? "canceled" : ele.status === 2 ? "absent" : "upcoming",
          statusCode: ele.status as 1 | 3 | 2 | 0,
          name: ele.prestation.name,
          image: "https://" + process.env.STORAGE_HOST! + "/" + ele.prestation.image.replace(/\.\w+$/, ".webp"),
          description: ele.prestation.description
        }))
      }

      return []
    } catch {
      return []
    }
  },
  ["get-reservations"],
  { revalidate: 1800, tags: ["reservations"] }
)

async function clearReservationsCache(): Promise<void> {
  updateTag("reservations")
}

async function changeReservationStatus(token: string, reservation: string, status: number): Promise<{
  success: boolean
  message: string
}> {
  try {

    const res = await fetch(`https://${process.env.API_HOST!}/api/appointment/changestatus?status=${status}&appointment_id=${reservation}`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` }
    })

    if (!res.ok) return { success: false, message: "Failed to change reservation status, please try again later" }

    const data: {
      success?: boolean
      message?: string
      status?: string
    } = await res.json()

    if (data?.status) return {
      success: false,
      message: "Failed to change reservation status, please try again later"
    }

    await clearReservationsCache()
    await clearPointsCache()

    return data as { success: boolean; message: string }
  } catch {
    return { success: false, message: "Failed to change reservation status, please try again later" }
  }
}

export {
  updateToken,
  getUser,
  userLogin,
  getServices,
  getPoints,
  getAllowances,
  getHolidays,
  getTimeSlotes,
  makeReservation,
  getReservations,
  changeReservationStatus,
  clearToken,
  clearServicesCache,
  clearPointsCache,
  clearAllowancesCache,
  clearHolidaysCache,
  clearReservationsCache
}