import { NextRequest, NextResponse } from "next/server"
import { getToken } from "@/actions"

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"
}

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
  const { pathname } = request.nextUrl
  const t = await getToken()

  if (pathname.startsWith("/login") && t)
    return NextResponse.redirect(new URL("/", request.url))

  if (!t && !pathname.startsWith("/login"))
    return NextResponse.redirect(new URL("/login", request.url))

  return NextResponse.next()
}