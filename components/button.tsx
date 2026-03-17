"use client"
import { IconLoader } from "@/icons"

export default function Button({
  children,
  onClick,
  loading = false,
  className = ""
}: {
  children: React.ReactNode
  onClick: () => any
  loading?: boolean
  className?: string
}): React.JSX.Element {
  return (
    <button
      onClick={!loading ? onClick : () => {}}
      className={`flex items-center justify-center transition-all duration-200 ease-in-out
      bg-black text-white rounded-sm min-h-11 cursor-pointer
      hover:bg-black/80 ${loading && "cursor-not-allowed bg-black/80!"}
      hover:-translate-y-0.5 w-full ${className}`}
    >
      { loading ? <IconLoader color="white"/> : children }
    </button>
  )
}