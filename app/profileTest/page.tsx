import { getUser, getCampuses, getProfile } from "@/actions"
import CampusesTest from "./campusesTest"

export default async function Profile(): Promise<React.JSX.Element> {

  const user = await getUser()
  const campuses = await getCampuses(user?.token!)
  const profile = await getProfile(user?.token!)

  return (
    <>
      <p> campuses: </p>
      <CampusesTest campuses={campuses} user={user} />

      <p> profile: </p>
      <pre>
        {JSON.stringify(profile, null, 2)}
      </pre>
    </>
  )
}