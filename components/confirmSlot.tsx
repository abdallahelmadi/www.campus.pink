export default function ConfirmSlot({
  active,
  cancel,
  handleBook
}: {
  active: boolean
  cancel: () => void
  handleBook: () => Promise<void>
}): React.JSX.Element {
  return (
    <>
      <div
        className={`fixed inset-0 z-100 bg-[hsl(0deg_0%_98%/50%)]
        ${active ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"}
        transition-opacity duration-300 ease-in-out`}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) cancel()
        }}
      />

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-120 h-50 bg-white rounded-t-2xl border-t
        border-gray-200 transition-transform duration-300 ease-in-out p-4
        ${active ? "translate-y-0" : "translate-y-full"}`}
      >

        hello, can you see me ?

      </div>
    </>
  )
}