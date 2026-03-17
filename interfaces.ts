interface Service {
  id: number
  name: string | null
  description: string | null
  logo: string | null
  cover: string | null
}

interface Points {
  points: number
  tombola: boolean
  tombolaPoints: number
  rank: number
}

interface Allowance {
  id: number
  name: string | null
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

interface User {
  token: string
  name: string | undefined
  gender: string | undefined
  email: string | undefined
  phone: string | undefined
  campus: {
    name: string | undefined
    id: number | undefined
  }
}

export type {
  Service,
  Points,
  Allowance,
  Holiday,
  TimeSlote,
  Reservation,
  Icon,
  User
}