import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/actions"

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {

  const { pathname } = request.nextUrl
  const t = await getUser()

  if (pathname.startsWith("/login") && t)
    return NextResponse.redirect(new URL("/", request.url))

  if (!t && !pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/login", request.url))

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"
}