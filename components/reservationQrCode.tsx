"use client"
import { QRCodeSVG } from "qrcode.react"

export default function ReservationQrCode({
  code,
  removeCode
}: {
  code: string | null
  removeCode: () => void
}): React.JSX.Element {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/5 z-100
      backdrop-blur-sm transition-opacity duration-300 ease-in-out
      ${code ? "visible opacity-100" : "opacity-0 invisible"}`}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.target === e.currentTarget && removeCode()}
    >

      <div className="p-2 bg-white rounded-sm shadow-lg">
        <QRCodeSVG
          value={code!}
          size={220}
          bgColor="#fff"
          fgColor="#000"
          level="Q"
          className="rounded-sm"
        />
      </div>

    </div>
  )
}