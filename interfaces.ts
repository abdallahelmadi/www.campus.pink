enum CampusEnum {
  "RABAT" = 1,
  "BEN_GUERIR" = 2
}

enum RoleEnum {
  "STUDENT" = 6
}

enum ReservationStatusEnum {
  "UPCOMING" = 0,
  "APPROVED" = 1,
  "ABSENT" = 2,
  "CANCELED" = 3
}

interface Service {
  id: number
  name: string
  description: string | null
  logo: string
  cover: string
  campus: CampusEnum[]
  roles: RoleEnum[]
}

interface Prestation {
  id: number
  name: string
  description: string | null
  image: string
  dateLimit: string | null
  capacity: string
  duration: string
  gender: string
  enable: number
  campus: CampusEnum
  roles: RoleEnum[]
}

interface Holiday {
  description: string
  isOff: string
  date: string
  event: string
}

interface Slot {
  id: number
  start: string
  end: string
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
  start: string
  end: string
  qrCode: string
  status: ReservationStatusEnum
  name: string
  image: string
}

interface Profile {
  id: number
  name: string
  email: string
  qrCode: string
  roles: RoleEnum[]
  campus: number
  gender: string
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
  Prestation,
  Holiday,
  Slot,
  Reservation,
  Profile,
  Article
}