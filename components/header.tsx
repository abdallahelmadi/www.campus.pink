import type { User, Points } from "@/interfaces"
import HeaderProfile from "@/components/headerProfile"
import Link from "next/link"
import { IconMenu } from "@/icons"
import { getPoints } from "@/actions"

export default async function Header({
  user
}: {
  user: User | undefined
}): Promise<React.JSX.Element> {

  const points: Points | undefined = user ? await getPoints(user.token) : undefined

  return (
    <header
      suppressHydrationWarning
      className="fixed top-0 left-0 w-full px-2 h-11 border
      border-gray-200 shadow-xs bg-white/90 backdrop-blur-xs
      flex items-center justify-between select-none z-50"
    >

      <Link
        href="/reservations"
        className="bg-gray-50 border border-gray-200 text-gray-600 w-8 h-8
        rounded-full flex items-center justify-center
        transition duration-200 ease-in-out hover:bg-gray-100"
      >
        <IconMenu color="black" size={15} />
      </Link>

      <HeaderProfile user={user} points={points?.points} />

    </header>
  )
}