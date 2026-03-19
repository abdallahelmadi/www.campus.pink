"use client"
import { useState } from "react"
import { IconEmail } from "@/icons"
import { userLogin } from "@/actions"
import { redirect } from "next/navigation"
import Input from "@/components/input"
import Button from "@/components/button"
import Canva from "@/components/canva"
import Checkbox from "@/components/checkbox"

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) &&
    (email.split("@")[1] === "um6p.ma" || email.split("@")[1] === "student.1337.ma")
}

function getInitialFormState(): { email: string; password: string } {
  if (typeof window === "undefined") {
    return { email: "", password: "" }
  }
  const bc_token = JSON.parse(localStorage.getItem("bc_token") || "null")
  if (bc_token && bc_token?.email && bc_token?.password) {
    return { email: bc_token.email, password: bc_token.password }
  }
  return { email: "", password: "" }
}

export default function Login(): React.JSX.Element {

  const initialState = getInitialFormState()
  const [email, setEmail] = useState<string>(initialState.email)
  const [password, setPassword] = useState<string>(initialState.password)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [remember, setRemember] = useState<boolean>(true)

  const handleEmailChange = (v: string): void => {
    setEmail(v)
    if (validateEmail(v.trim())) {
      setEmailError(false)
    }
  }

  const handlePasswordChange = (v: string): void => {
    setPassword(v)
    if (v.length > 5) {
      setPasswordError(false)
    }
  }

  async function loginHandler(): Promise<void> {
    if (!validateEmail(email.trim())) setEmailError(true)
    if (password.length < 6) setPasswordError(true)
    if (!validateEmail(email.trim()) || password.length < 6) return
    setLoading(true)
    const r = await userLogin(email.trim(), password)
    if (!r) {
      setPasswordError(true)
    } else {
      if (remember) {
        localStorage.setItem("bc_token", JSON.stringify({ email, password }))
      } else {
        localStorage.removeItem("bc_token")
      }
      redirect("/")
    }
    setLoading(false)
  }

  return (
    <>
      <Canva className="fixed inset-0 z-10"/>

      <div className="fixed inset-0 z-11 flex items-center justify-center px-2">
        <div
          suppressHydrationWarning
          className="bg-white p-4 rounded-sm w-full max-w-120 border border-gray-200
          shadow-2xl flex flex-col items-center"
        >

          <p className="text-center text-xl font-medium text-bleck"> Hello! </p>
          <span className="text-center text-[13px] text-gray-700">
            Please use your campus plus email to continue with better-campus.
          </span>

          <div className="mt-4 flex flex-col gap-3 w-full">
            <Input
              error={emailError}
              placeholder="name@um6p.ma"
              onChange={handleEmailChange}
              value={email}
              max={48}
              icon={<IconEmail color="black"/>}
              disabled={loading}
              className="rounded-sm"
            />
            <Input
              error={passwordError}
              placeholder="Y^7$2n!A"
              onChange={handlePasswordChange}
              value={password}
              max={40}
              disabled={loading}
              className="rounded-sm"
              password
            />
          </div>

          <div className="w-full flex items-center justify-start">
            <Checkbox
              disabled={loading}
              text="Remember me"
              onChange={(v): void => setRemember(v)}
              value={remember}
            />
          </div>

          <Button
            onClick={loginHandler}
            loading={loading}
            className="mt-4"
          >
            login
          </Button>

        </div>
      </div>
    </>
  )
}