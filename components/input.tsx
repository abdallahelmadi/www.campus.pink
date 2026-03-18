"use client"
import { useState } from "react"
import { IconEye, IconEyeOff } from "@/icons"

export default function Input({
  error = false,
  placeholder,
  title = "",
  onChange,
  value,
  max = 99,
  icon,
  disabled = false,
  className = "",
  password = false
}: {
  error?: boolean
  placeholder: string
  title?: string
  onChange: (v: string) => void
  value: string
  max?: number
  icon?: React.JSX.Element
  disabled?: boolean
  className?: string
  password?: boolean
}): React.JSX.Element {

  const [onFocus, setOnFocus] = useState<boolean>(false)
  const [passwordToggle, setPasswordToggle] = useState<boolean>(true)

  return (
    <div className="flex flex-col w-full">

      { title &&
        <span className="mb-1 text-[13px] max-md:text-[12px] text-black"> { title } </span>
      }

      <div
        className={`cursor-text text-[0.875rem] transition-all duration-300 w-full h-11 flex
        shadow-[0_0_0_1px_rgba(0,0,0,0.2)] items-center justify-between
        hover:shadow-[0_0_0_1px_rgba(0,0,0,0.38)] ${className}
        ${(onFocus && !error) ? "shadow-[0_0_0_1px_rgba(0,0,0,0.34),0_0_0_4px_rgba(0,0,0,0.16)_!important]" : ""}
        ${error ? "shadow-[0_0_0_1px_hsla(0,100%,50%,0.34),0_0_0_4px_rgba(255,0,0,0.16)_!important]" : ""}`}
      >

        <input
          suppressHydrationWarning
          type={(password && passwordToggle) ? "password" : "text"}
          placeholder={placeholder}
          className="outline-none w-full h-full placeholder:text-[#888]
          placeholder:text-[13px] pl-4 pr-1 text-black bg-transparent select-none"
          onFocus={(): void => { setOnFocus(true) }}
          onBlur={(): void => { setOnFocus(false) }}
          onChange={(e): void => {
            if (e.target.value.length > max)
              return
            onChange(e.target.value)
          }}
          value={value}
          spellCheck={false}
          disabled={disabled}
        />

        { icon &&
          <div className="bg-none h-full w-11 flex items-center justify-center cursor-pointer">
            { icon }
          </div>
        }

        { password &&
          <div
            className="bg-none h-full w-11 flex items-center justify-center cursor-pointer"
            onClick={() => setPasswordToggle(prev => !prev)}
          >
            { passwordToggle ? <IconEye color="black"/> : <IconEyeOff color="black"/> }
          </div>
        }

      </div>

    </div>
  )
}