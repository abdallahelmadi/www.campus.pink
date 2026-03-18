export default async function ServiceById({
  params
}: {
  params: Promise<{ service_id: string; allowance_id: string }>
}): Promise<React.JSX.Element> {

  const { service_id, allowance_id } = await params
  const serviceId = Number(service_id)
  const allowanceId = Number(allowance_id)

  return (
    <> {serviceId} - {allowanceId} </>
  )
}