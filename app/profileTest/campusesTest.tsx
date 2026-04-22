"use client"
import { switchCampus } from "@/actions"
import type { User } from "@/interfaces"

export default function CampusesTest({
  campuses,
  user
}: {
  campuses: {
    id: number
    name: string
  }[]
  user: User | undefined
}): React.JSX.Element {
  return (
    <>
      { campuses.map(campus => (
        <div key={campus.id} className="flex items-center gap-2">
          <span> {campus.name} </span>
          <button onClick={() => switchCampus(user?.token!, campus.id, campus.name)}>
            Switch
          </button>
        </div>
      )) }
    </>
  )
}