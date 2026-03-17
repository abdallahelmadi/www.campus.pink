export default function ServiceSlotLayout({
  children,
  details
}: {
  children: React.ReactNode
  details: React.ReactNode
}): React.JSX.Element {
  return (
    <>
      {children}
      {details}
    </>
  )
}
