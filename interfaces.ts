type stringonull = string | null

enum CampusEnum {
  "RABAT" = 1,
  "BEN_GUERIR" = 2
}

enum SchoolEnum {
  
}

interface Service {
  id: number
  name: stringonull
  description: stringonull
  logo: stringonull
  cover: stringonull
  campus: CampusEnum
}

interface Allowance {
  id: number
  name: string
  capacity: string | null
  image: string | null
  description: string | null
  duration: string | null
  gender: string | null
  enable: number
  campus: {
    name: string | null
  }
}

interface Holiday {
  description: string | null
  isOff: string | null
  date: string | null
  event: string | null
}

interface TimeSlote {
  id: number
  start: string | null
  end: string | null
  capacity: number
  reserved: number
  present: number
  canBook: boolean
  isPause: boolean
  isMaintenance: boolean
  waitingList: boolean
}

interface Reservation {
  id: string
  start: string | null
  end: string | null
  qrCode: string | null
  status: "approved" | "canceled" | "absent" | "upcoming"
  statusCode: 1 | 3 | 2 | 0
  name: string | null
  image: string | null
  description: string | null
}

interface Icon {
  size?: number
  color?: string
}

interface Campus {
  id: number
  name: string
  image: string
}

interface Profile {
  id: number
  name: string
  email: string
  phone: string
  emailVerifiedAt: string
  createdAt: string
  updatedAt: string
  qrCode: string
  roleId: number
  roleName: string
  schoolId: number | null
  campusId: number
  campusName: string
  gender: string
  programId: string | number | null
}

interface Article {
  title: string
  description: string
  summary: string
  image: string
  slug: string
}

export type {
  Service,
  // Points,
  Allowance,
  Holiday,
  TimeSlote,
  Reservation,
  Icon,
  Campus,
  Profile,
  Article,

  CampusEnum
}