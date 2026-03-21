import { put } from "@vercel/blob"
import sharp from "sharp"
import jwt from "jsonwebtoken"
import { getServices, getAllowances } from "@/actions"
import type { Service, Allowance } from "@/interfaces"

export const runtime = "nodejs"

export async function PUT(req: Request): Promise<Response> {
  try {

    const { token, page }: { token: string; page?: number } = await req.json()
    
    if (!token) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        exp?: number
        token?: string
      }
    } catch {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
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

    const totalPages = Math.ceil(pictures.length / 10)
    const startIdx = ((page || 1) - 1) * 10
    const endIdx = startIdx + 10
    const pagePictures = pictures.slice(startIdx, endIdx)

    if (pagePictures.length === 0) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 400 })
    }

    const results = await Promise.allSettled(
      pagePictures.map(async (picture) => {
        try {
          const res = await fetch(picture)
          if (!res.ok) return false

          const arrayBuffer = await res.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const webpBuffer = await sharp(buffer).webp({ quality: 75 }).toBuffer()
          const fullPath = picture.replace(`https://${process.env.API_HOST!}/`, "").replace(/\.\w+$/, ".webp")

          await put(fullPath, webpBuffer, {
            access: "public",
            contentType: "image/webp",
            addRandomSuffix: false,
            allowOverwrite: false // true
          })

          return true
        } catch (error) {
          console.error("API: v1 failed to process picture: ", error)
          return false
        }
      })
    )

    const done = results.filter(r => r.status === "fulfilled" && r.value === true).length

    return new Response(JSON.stringify({ 
      message: `OK: ${done}/${pagePictures.length}`,
      page: `INFO: ${page || 1}/${totalPages}`
    }), { status: 200 })

  } catch (error) {
    console.log("API: v1 failed: ", error)
    return new Response(JSON.stringify({ message: "KO" }), { status: 500 })
  }
}