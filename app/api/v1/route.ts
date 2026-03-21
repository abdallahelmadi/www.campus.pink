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

    const services: Service[] = await getServices(_token, true)
    if (services.length === 0) {
      return new Response(JSON.stringify({ message: "KO" }), { status: 404 })
    }

    const allowances: Allowance[] = []
    for (const service of services) {
      const serviceAllowances = await getAllowances(_token, service.id, true)
      allowances.push(...serviceAllowances)
    }









    // // 1. Fetch remote image
    // const res = await fetch(imageUrl);
    // if (!res.ok) {
    //   return new Response("Failed to fetch image", { status: 400 });
    // }

    // const arrayBuffer = await res.arrayBuffer();
    // const buffer = Buffer.from(arrayBuffer);

    // // 2. Convert to WebP (quality 75)
    // const webpBuffer = await sharp(buffer)
    //   .webp({ quality: 75 })
    //   .toBuffer();

    // // 3. Upload to Vercel Blob
    // const blob = await put(`${filename}.webp`, webpBuffer, {
    //   access: "public",
    //   contentType: "image/webp",
    // });

    // return Response.json({
    //   success: true,
    //   url: blob.url,
    // });

    return new Response(JSON.stringify({ message: "OK" }), { status: 200 })

  } catch (err: Error | unknown) {
    console.log("API: v1 failed: ", err instanceof Error ? err.message : err)
    return new Response(JSON.stringify({ message: "KO" }), { status: 500 })
  }
}