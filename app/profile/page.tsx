import { getUser, getCampuses, switchCampus, getProfile } from "@/actions"

export default async function Profile(): Promise<React.JSX.Element> {

  const user = await getUser()
  const campuses = await getCampuses(user?.token!)
  const profile = await getProfile(user?.token!)

  return (
    <>
      <p> campuses: </p>
      {
        campuses.map(campus => (
          <div key={campus.id} className="flex items-center gap-2">
            <span> {campus.name} </span>
            <button onClick={() => switchCampus(user?.token!, campus.id, campus.name)}>
              Switch
            </button>
          </div>
        ))
      }

      <p> profile: </p>
      <pre>
        {JSON.stringify(profile, null, 2)}
      </pre>
    </>
  )
}