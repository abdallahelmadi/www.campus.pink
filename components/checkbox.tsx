"use client"
import { IconCross } from "@/icons"

export default function Checkbox({
  text,
  value,
  onChange,
  disabled
}: {
  text: string
  value: boolean
  onChange: (v: boolean) => void
  disabled: boolean
}): React.JSX.Element {
  return (
    <div
      className="flex items-center gap-2justify-start cursor-pointer w-full"
      onClick={() => onChange(!disabled ? !value : value)}
    >
      <div
        className={`w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center
        transition-all duration-200 ease-in-out
        ${value && "bg-black shadow-sm shadow-black"}`}
      >
        <IconCross color="white" size={8}/>
      </div>
      <span className="text-[#222] text-[12px]"> {text} </span>
    </div>
  )
}