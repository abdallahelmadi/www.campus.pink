"use client"
import { useState, useEffect } from "react"
import { IconEmail } from "@/icons"
import { userLogin } from "@/actions"
import { redirect } from "next/navigation"
import Input from "@/components/input"
import Button from "@/components/button"
import Canva from "@/components/canva"

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) &&
    (email.split("@")[1] === "um6p.ma" || email.split("@")[1] === "student.1337.ma")
}

export default function Login(): React.JSX.Element {

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [emailError, setEmailError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (password.length > 5) setPasswordError(false)
  }, [password])

  useEffect(() => {
    if (validateEmail(email.trim())) setEmailError(false)
  }, [email])

  async function loginHandler(): Promise<void> {
    if (!validateEmail(email.trim())) setEmailError(true)
    if (password.length < 6) setPasswordError(true)
    if (!validateEmail(email.trim()) || password.length < 6) return
    setLoading(true)
    const r = await userLogin(email.trim(), password)
    if (!r) {
      setEmailError(true)
      setPasswordError(true)
    } else redirect("/")
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
              onChange={(v): void => setEmail(v)}
              value={email}
              max={48}
              icon={<IconEmail color="black"/>}
              disabled={loading}
              className="rounded-sm"
            />
            <Input
              error={passwordError}
              placeholder="Y^7$2n!A"
              onChange={(v): void => setPassword(v)}
              value={password}
              max={40}
              disabled={loading}
              className="rounded-sm"
              password
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