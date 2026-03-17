export default async function AllowanceDetails({
  params
}: {
  params: Promise<{ service_id: string; allowance_id: string }>
}): Promise<React.JSX.Element> {

  const { service_id, allowance_id } = await params

  return (
    <div className="fixed inset-0 z-999999 bg-black/30 text-white">
      {service_id} - {allowance_id}
    </div>
  )
}