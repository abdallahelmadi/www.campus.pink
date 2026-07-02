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
  Campus,
  Profile,
  Article
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

async function getToken(_t?: string | undefined): Promise<string | undefined> {
  try {

    const t = (await cookies()).get("t")?.value || _t
    if (!t) return undefined

    const decoded = jwt.verify(t, process.env.JWT_SECRET!) as {
      token: string
    } | null

    if (!decoded) return undefined

    const now = Math.floor(Date.now() / 1000)

    const decodedApiToken = jwt.decode(decoded.token) as {
      exp?: number
    } | null

    if (!decodedApiToken?.exp) return undefined
    if (decodedApiToken.exp < now) return undefined

    return decoded.token || undefined
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
      }

      if (!data?.token) return false

      const decodedToken = jwt.decode(data.token) as {
        exp?: number
      } | null

      if (!decodedToken?.exp) return false

      const payload = {
        token: data.token
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

async function getServices(getOriginPictures: boolean = false): Promise<Service[]> {

  const token = await getToken()
  if (!token) return []

  const profile = await getProfile()
  const campusId = profile?.campusId || 2

  const c = unstable_cache(
    async (): Promise<Service[]> => {
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
            logo: "https://" +
              (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
              "/" + (getOriginPictures ? ele.logo : ele.logo?.replace(/\.\w+$/, ".webp")),
            cover: "https://" +
              (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
              "/" + (getOriginPictures ? ele.cover : ele.cover?.replace(/\.\w+$/, ".webp"))
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
                    logo: "https://" +
                      (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
                      "/" + (getOriginPictures ? ele.logo : ele.logo?.replace(/\.\w+$/, ".webp")),
                    cover: "https://" +
                      (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
                      "/" + (getOriginPictures ? ele.cover : ele.cover?.replace(/\.\w+$/, ".webp"))
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
    [`get-services-${campusId}-${token.slice(-64)}`],
    { revalidate: 2592000, tags: [`services-${campusId}-${token.slice(-64)}`] }
  )
  return c()
}

async function clearServicesCache(campusId: number): Promise<void> {
  const token = await getToken() || ""
  updateTag(`services-${campusId}-${token.slice(-64)}`)
}

async function getPoints(): Promise<Points | undefined> {

  const token = await getToken()
  if (!token) return undefined

  const c = unstable_cache(
    async (): Promise<Points | undefined> => {
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
    [`get-points-${token.slice(-64)}`],
    { revalidate: 86400, tags: [`points-${token.slice(-64)}`] }
  )
  return c()
}

async function clearPointsCache(): Promise<void> {
  const token = await getToken() || ""
  updateTag(`points-${token.slice(-64)}`)
}

async function getAllowances(id: number, getOriginPictures: boolean = false): Promise<Allowance[]> {

  const token = await getToken()
  if (!token) return []

  const profile = await getProfile()
  const campusId = profile?.campusId || 2

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
            image: "https://" +
              (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
              "/" + (getOriginPictures ? ele.image : ele.image?.replace(/\.\w+$/, ".webp")),
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
                    image: "https://" +
                      (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
                      "/" + (getOriginPictures ? ele.image : ele.image?.replace(/\.\w+$/, ".webp")),
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
    [`get-allowances-${campusId}-${id}-${token.slice(-64)}`],
    { revalidate: 2592000, tags: [`allowances-${campusId}-${id}-${token.slice(-64)}`] }
  )
  return c()
}

async function clearAllowancesCache(id: number, campusId: number): Promise<void> {
  const token = await getToken() || ""
  updateTag(`allowances-${campusId}-${id}-${token.slice(-64)}`)
}

async function getHolidays(): Promise<Holiday[]> {

  const token = await getToken()
  if (!token) return []

  const c = unstable_cache(
    async (): Promise<Holiday[]> => {
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
    { revalidate: 5000, tags: ["holidays"] }
  )
  return c()
}

async function clearHolidaysCache(): Promise<void> {
  updateTag("holidays")
}

async function getTimeSlotes(
  allowance: number,
  date: string
): Promise<TimeSlote[]> {
  try {

    const token = await getToken()
    if (!token) return []

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
  allowance: number,
  date: string,
  timeslot: number
): Promise<{
  success: boolean
  message: string
}> {
  try {

    const token = await getToken()
    if (!token) return { success: false, message: "No token provided" }

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

async function getReservations(page: number, getOriginPictures: boolean = false): Promise<Reservation[]> {

  const token = await getToken()
  if (!token) return []

  const c = unstable_cache(
    async (): Promise<Reservation[]> => {
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
            image: "https://" +
              (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
              "/" + (getOriginPictures ? ele.prestation.image : ele.prestation.image?.replace(/\.\w+$/, ".webp")),
            description: ele.prestation.description
          }))
        }

        return []
      } catch {
        return []
      }
    },
    [`get-reservations-${token.slice(-64)}-page-${page}`],
    { revalidate: 1800, tags: [`reservations-${token.slice(-64)}`] }
  )
  return c()
}

async function clearReservationsCache(): Promise<void> {
  const token = await getToken() || ""
  updateTag(`reservations-${token.slice(-64)}`)
}

async function changeReservationStatus(reservation: string, status: number): Promise<{
  success: boolean
  message: string
}> {
  try {

    const token = await getToken()
    if (!token) return { success: false, message: "No token provided" }

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

async function getCampuses(getOriginPictures: boolean = false): Promise<Campus[]> {

  const token = await getToken()
  if (!token) return []

  const c = unstable_cache(
    async (): Promise<Campus[]> => {
      try {

        const res = await fetch(`https://${process.env.API_HOST!}/api/campus/list`, {
          method: "POST",
          headers: { "Authorization": `bearer ${token}` }
        })

        if (res.ok) {
          const data: {
            data?: {
              id: number
              name: string
              image: string
            }[]
            last_page?: number
          } = await res.json()

          if (!Array.isArray(data?.data) || data?.data.length === 0) return []

          const campuses: Campus[] = data.data.map<Campus>(ele => ({
            id: ele.id,
            name: ele.name,
            image: "https://" +
              (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
              "/" + (getOriginPictures ? ele.image : ele.image?.replace(/\.\w+$/, ".webp"))
          }))

          if (data?.last_page && data.last_page > 1) {
            const fetches = Array.from({ length: data.last_page - 1 }, (_, i) => {
              const page = i + 2
              return fetch(`https://${process.env.API_HOST!}/api/campus/list?page=${page}`, {
                method: "POST",
                headers: { "Authorization": `bearer ${token}` }
              }).then(r => r.json())
            })

            const jsons: {
              data?: {
                id: number
                name: string
                image: string
              }[]
            }[] = await Promise.all(fetches)

            campuses.push(
              ...jsons.flatMap(pageData =>
                Array.isArray(pageData?.data)
                ? pageData.data.map<Campus>(ele => ({
                    id: ele.id,
                    name: ele.name,
                    image: "https://" +
                      (getOriginPictures ? process.env.API_HOST! : process.env.STORAGE_HOST!) +
                      "/" + (getOriginPictures ? ele.image : ele.image?.replace(/\.\w+$/, ".webp"))
                  }))
                : []
              )
            )
          }

          return campuses
        }

        return []
      } catch {
        return []
      }
    },
    ["get-campuses"],
    { revalidate: 2592000, tags: ["campuses"] }
  )
  return c()
}

async function switchCampus(id: number, name: string): Promise<boolean> {
  try {

    const token = await getToken()
    if (!token) return false

    const res = await fetch(`https://${process.env.API_HOST!}/api/profile/update`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` },
      body: JSON.stringify({
        campus: id
      })
    })

    if (res.ok) {
      const data: { success?: boolean } = await res.json()
      return data?.success ?? false
    }

    return false
  } catch {
    return false
  }
}

async function getProfile(): Promise<Profile | undefined> {
  try {

    const token = await getToken()
    if (!token) return undefined

    const res = await fetch(`https://${process.env.API_HOST!}/api/get_user`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` }
    })

    if (res.ok) {
      const data: {
        success?: boolean
        user?: {
          id: number
          name: string
          email: string
          phone: string
          email_verified_at: string
          created_at: string
          updated_at: string
          code_qr: string
          role_id: number
          type: string
          school_id: number | null
          campus_id: number
          campus: {
            name: string
          }
          gender: string
          program_id: string | number | null
        }
      } = await res.json()

      if (!data.success || !data.user) return undefined

      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        emailVerifiedAt: data.user.email_verified_at,
        createdAt: data.user.created_at,
        updatedAt: data.user.updated_at,
        qrCode: data.user.code_qr,
        roleId: data.user.role_id,
        roleName: data.user.type,
        schoolId: data.user.school_id,
        campusId: data.user.campus_id,
        campusName: data.user.campus.name,
        gender: data.user.gender,
        programId: data.user.program_id
      } as Profile
    }

    return undefined
  } catch {
    return undefined
  }
}

async function getArticles(length: number = 10): Promise<Article[]> {
  const c = unstable_cache(
    async (): Promise<Article[]> => {
      try {
        const res = await fetch(`https://${process.env.SECONDARY_API_HOST!}/myjsonum6p/get-nodes/en/article/field_image/${length}`)

        if (res.ok) {
          const data: {
            title: string
            body: string
            summary: string
            image: string
            path: string
          }[] = await res.json()

          if (!Array.isArray(data) || data.length === 0) return []

          return data.map<Article>(ele => ({
            title: ele.title,
            description: ele.body,
            summary: ele.summary,
            image: ele.image,
            path: ele.path
          }))
        }

        return []
      } catch {
        return []
      }
    },
    ["get-articles"],
    { revalidate: 86400, tags: ["articles"] }
  )
  return c()
}

export {
  updateToken,
  getToken,
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
  clearReservationsCache,
  getCampuses,
  switchCampus,
  getProfile,
  getArticles
}