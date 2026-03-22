import { put } from "@vercel/blob"
import sharp from "sharp"
import { getServices, getAllowances, getUser } from "@/actions"
import type { Service, Allowance, User } from "@/interfaces"

export const runtime = "nodejs"

export async function PUT(req: Request): Promise<Response> {
  try {

    let t: string | undefined
    try {
      const body = await req.json() as { t?: string | undefined }
      t = body?.t
    } catch {}

    const user: User | undefined = await getUser(t)
    if (!user) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 401 })
    }

    const token = user.token

    const url = new URL(req.url)
    const pageParam = url.searchParams.get("page")
    const page = pageParam ? Number(pageParam) : 1

    if (isNaN(page) || page < 1) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 400 })
    }

    const pictures: string[] = []

    const services: Service[] = await getServices(token, true)
    if (services.length === 0) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 404 })
    }

    for (const service of services) {
      pictures.push(service.logo!, service.cover!)
      const serviceAllowances: Allowance[] = await getAllowances(token, service.id, true)
      for (const allowance of serviceAllowances) {
        pictures.push(allowance.image!)
      }
    }

    const totalPages = Math.ceil(pictures.length / 10)
    const startIdx = (page - 1) * 10
    const endIdx = startIdx + 10
    const pagePictures = pictures.slice(startIdx, endIdx)

    if (pagePictures.length === 0) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 400 })
    }

    const results = await Promise.allSettled(
      pagePictures.map(async picture => {
        try {

          const validExtensions = [
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".tif", ".tiff",
            ".bmp", ".heic", ".heif", ".avif", ".svg", ".ico"
          ]
          const extension = picture.toLowerCase().match(/\.\w+$/)?.[0]
          if (!extension || !validExtensions.includes(extension)) {
            throw new Error(`unsupported file type: ${extension}`)
          }

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
            allowOverwrite: true
          })

          return true
        } catch (error) {
          console.error("API: v1 process picture failed: ", error)
          return false
        }
      })
    )

    const done = results.filter(r => r.status === "fulfilled" && r.value === true).length

    return new Response(JSON.stringify({ 
      message: `${done}/${pagePictures.length}`,
      page: `${page}/${totalPages}`,
      nextPage: page < totalPages ? `https://${process.env.BETTER_CAMPUS_HOST!}/api/v1?page=${page + 1}` : null
    }), { status: 200 })

  } catch (error) {
    console.error("API: v1 failed: ", error)
    return new Response(JSON.stringify({ message: "KO" }), { status: 500 })
  }
}