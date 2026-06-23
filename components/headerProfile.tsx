"use client"
import Image from "next/image"

export default function HeaderProfile({
  points
}: {
  points: number | undefined
}): React.JSX.Element {
  return (
    <div className="relative cursor-pointer">

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

    </div>
  )
}