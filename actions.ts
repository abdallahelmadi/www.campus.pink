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
  User,
  Campus,
  Profile
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

async function getUser(_t?: string | undefined): Promise<User | undefined> {
  try {

    const t = (await cookies()).get("t")?.value || _t
    if (!t) return undefined

    const decoded = jwt.verify(t, process.env.JWT_SECRET!) as {
      exp: number
      token: string
      name: string
      email: string
      gender: string
      phone: string
      campus: {
        id: number
        name: string
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

async function getServices(token: string, getOriginPictures: boolean = false): Promise<Service[]> {

  const campusId = await getProfile(token)

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
  updateTag(`services-${campusId}`)
}

async function getPoints(token: string): Promise<Points | undefined> {
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

async function clearPointsCache(token: string): Promise<void> {
  updateTag(`points-${token.slice(-64)}`)
}

async function getAllowances(token: string, id: number, getOriginPictures: boolean = false): Promise<Allowance[]> {

  const campusId = await getProfile(token)

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
  updateTag(`allowances-${campusId}-${id}`)
}

async function getHolidays(token: string): Promise<Holiday[]> {
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
    { revalidate: 500, tags: ["holidays"] }
  )
  return c()
}

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

    await clearPointsCache(token)
    await clearReservationsCache(token)

    return data as { success: boolean; message: string }
  } catch {
    return { success: false, message: "Failed to make reservation, please try again later" }
  }
}

async function getReservations(token: string, page: number, getOriginPictures: boolean = false): Promise<Reservation[]> {
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

async function clearReservationsCache(token: string): Promise<void> {
  updateTag(`reservations-${token.slice(-64)}`)
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

    await clearReservationsCache(token)
    await clearPointsCache(token)

    return data as { success: boolean; message: string }
  } catch {
    return { success: false, message: "Failed to change reservation status, please try again later" }
  }
}

async function getCampuses(token: string, getOriginPictures: boolean = false): Promise<Campus[]> {
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

async function switchCampus(token: string, id: number, name: string): Promise<boolean> {
  try {

    const res = await fetch(`https://${process.env.API_HOST!}/api/profile/update`, {
      method: "POST",
      headers: { "Authorization": `bearer ${token}` },
      body: JSON.stringify({
        campus: id
      })
    })

    if (res.ok) {
      const data: { success?: boolean } = await res.json()
      if (!data?.success) return false

      const user = await getUser()
      if (!user) return false

      const payload = {
        token: user.token,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        campus: {
          id: id,
          name: name
        },
        exp: user.exp
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

async function getProfile(token: string): Promise<Profile | undefined> {
  try {

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
  clearReservationsCache,
  getCampuses,
  switchCampus,
  getProfile
}