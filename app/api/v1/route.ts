import { put } from "@vercel/blob"
import sharp from "sharp"
import jwt from "jsonwebtoken"
import { getServices, getAllowances } from "@/actions"
import type { Service, Allowance } from "@/interfaces"

export const runtime = "nodejs"

export async function PUT(req: Request): Promise<Response> {
  try {

    const { token }: { token: string } = await req.json()
    if (!token) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      exp?: number
      token?: string
    }

    if (!decoded || !decoded?.exp || !decoded?.token) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    const now = Math.floor(Date.now() / 1000)
    if (decoded?.exp < now) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    const _decoded = jwt.decode(decoded?.token) as {
      exp?: number
    }

    if (!_decoded || !_decoded?.exp || _decoded?.exp < now) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    const _token: string = decoded?.token
    const pictures: string[] = []

    const services: Service[] = await getServices(_token, true)
    if (services.length === 0) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 404 })
    }

    for (const service of services) {
      pictures.push(service.logo!, service.cover!)
      const serviceAllowances: Allowance[] = await getAllowances(_token, service.id, true)
      for (const allowance of serviceAllowances) {
        pictures.push(allowance.image!)
      }
    }

    let done = 0
    for (const picture of pictures) {
      try {

        const res = await fetch(picture)
        if (!res.ok) continue

        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer()
        const fullPath = picture.replace(`https://${process.env.API_HOST!}/`, "").replace(/\.\w+$/, ".webp")

        await put(fullPath, webpBuffer, {
          access: "public",
          contentType: "image/webp",
          addRandomSuffix: false,
          allowOverwrite: false
        })

        done++;
      } catch {}
    }

    return new Response(JSON.stringify({ message: `OK: ${done}/${pictures.length}` }), { status: 200 })

  } catch (err: Error | unknown) {
    console.log("API: v1 failed: ", err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ message: "KO" }), { status: 500 })
  }
}