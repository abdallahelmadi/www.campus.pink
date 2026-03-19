"use client"
import type { User } from "@/interfaces"
import Image from "next/image"
import { useState } from "react"
import { IconMenuArrow, IconLogout, IconLoader } from "@/icons"
import { clearToken } from "@/actions"

export default function HeaderProfile({
  user,
  points
}: {
  user: User | undefined
  points: number | undefined
}): React.JSX.Element {

  const [openProfile, setOpenProfile] = useState<boolean>(false)
  const [logouting, setLogouting] = useState<boolean>(false)

  return (
    <div
      className="relative cursor-pointer"
      onFocus={() => setOpenProfile(true)}
      onBlur={() => setOpenProfile(false)}
      tabIndex={0}
    >

      <Image
        src={"/avatar.svg"}
        alt=""
        width={32}
        height={32}
        draggable={false}
        quality={100}
        loading="eager"
        className="rounded-full object-cover object-center"
      />

      { points && (<div
        suppressHydrationWarning
        className="absolute -top-0.5 -left-0.5 px-1 rounded-[50px]
        bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium"
      >
        {points}
      </div>)}

      <div
        suppressHydrationWarning
        className={`absolute top-10 right-0 w-74 bg-white border border-gray-200 rounded-lg
        shadow-md py-2 px-3 text-sm text-gray-800 transition-all duration-200 ease-in-out
        ${(openProfile && user) ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}
        flex gap-3 flex-col`}
      >

        <div className="absolute -top-2 right-1.75">
          <IconMenuArrow color="white"/>
        </div>

        <div className="flex items-center gap-3">
          <Image
            src={"/avatar.svg"}
            alt=""
            width={44}
            height={44}
            draggable={false}
            quality={100}
            className="rounded-full object-cover object-center"
          />

          <div>
            <span className="font-medium text-[13px] text-black/90 line-clamp-1">
              {user?.email}
            </span>
            <p className="text-gray-600 text-[12px] line-clamp-1">
              {user?.campus.name}
            </p>
          </div>

          <div
            suppressHydrationWarning
            className="border border-gray-300 bg-gray-100 rounded-full font-medium
            flex items-center justify-center gap-2 w-6 h-6 text-gray-800 cursor-pointer
            absolute bottom-1 left-9"
            onClick={async () => {
              setLogouting(true)
              setTimeout(async () => {
                await clearToken()
                location.href = "/login"
              }, 400)
            }}
          >
            { logouting ?
              <IconLoader size={12} color="#1e2939"/> :
              <IconLogout size={12} color="#1e2939"/>
            }
          </div>
        </div>

      </div>

    </div>
  )
}