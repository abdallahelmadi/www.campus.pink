"use client"
import { useEffect, useRef } from "react"

export default function Canva({
  className = ""
}: {
  className?: string
}): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const startTime = performance.now()

    const blobs = [
      { x: 0.2, y: 0.0, r: 0.6, color: [0, 210, 211] },
      { x: 0.8, y: 0.1, r: 0.5, color: [129, 236, 236] },
      { x: 0.1, y: 0.5, r: 0.55, color: [108, 92, 231] },
      { x: 0.6, y: 0.4, r: 0.5, color: [162, 155, 254] },
      { x: 0.9, y: 0.6, r: 0.55, color: [255, 159, 243] },
      { x: 0.3, y: 0.8, r: 0.5, color: [253, 121, 168] },
      { x: 0.7, y: 0.9, r: 0.6, color: [250, 177, 160] },
      { x: 0.5, y: 0.3, r: 0.4, color: [102, 126, 234] }
    ]

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.setTransform(2, 0, 0, 2, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight

      if (cw === 0 || ch === 0) {
        animationId = requestAnimationFrame(animate)
        return
      }

      const t = (performance.now() - startTime) * 0.002

      const bufW = Math.ceil(cw / 6)
      const bufH = Math.ceil(ch / 6)

      const imgData = ctx.createImageData(bufW, bufH)
      const data = imgData.data

      for (let y = 0; y < bufH; y++) {
        for (let x = 0; x < bufW; x++) {
          const nx = x / bufW
          const ny = y / bufH

          let r = 0, g = 0, b = 0, totalWeight = 0

          for (const blob of blobs) {
            const bx = blob.x + Math.sin(t * (0.7 + blob.x) + blob.y * 3) * 0.12
            const by = blob.y + Math.cos(t * (0.5 + blob.y) + blob.x * 4) * 0.1

            const dx = nx - bx
            const dy = ny - by
            const dist = Math.sqrt(dx * dx + dy * dy)

            const w = Math.max(0, 1 - dist / blob.r)
            const weight = w * w * w

            r += blob.color[0] * weight
            g += blob.color[1] * weight
            b += blob.color[2] * weight
            totalWeight += weight
          }

          if (totalWeight > 0) {
            r /= totalWeight
            g /= totalWeight
            b /= totalWeight
          }

          const idx = (y * bufW + x) * 4
          data[idx] = Math.min(255, r)
          data[idx + 1] = Math.min(255, g)
          data[idx + 2] = Math.min(255, b)
          data[idx + 3] = 255
        }
      }

      const offscreen = new OffscreenCanvas(bufW, bufH)
      const offCtx = offscreen.getContext("2d")!
      offCtx.putImageData(imgData, 0, 0)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(offscreen, 0, 0, cw, ch)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
    />
  )
}