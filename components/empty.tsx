import { IconChart } from "@/icons"

export default function Empty({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}): React.JSX.Element {
  return (
    <main className={`flex flex-col items-center gap-4 w-full ${className}`}>
      <main
        className="max-w-340 w-full border border-gray-200 rounded-lg
        py-12 px-8 flex items-center flex-col gap-4 bg-gray-50"
      >
        <div
          className="bg-gray-100 border border-[#eaeaea] rounded-lg
          flex items-center justify-center p-3.5"
        >
          <IconChart size={32} color="black"/>
        </div>
        <p className="text-gray-800 text-center text-[13px]">
          {children}
        </p>
      </main>
    </main>
  )
}