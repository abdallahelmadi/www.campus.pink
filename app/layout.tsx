import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "@/app/globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "better-campus",
  description: "better-campus"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${geistMono.className} antialiased text-[14px] text-[#333]`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}