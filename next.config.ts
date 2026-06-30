import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [70, 80, 90, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        port: "443",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "myapi.um6p.ma",
        port: "443",
        pathname: "/**"
      }
    ]
  }
}

export default nextConfig