export default function Skeleton({
  className = ""
}: {
  className?: string
}): React.JSX.Element {
  return (
    <div className={`h-6 w-40 rounded-sm bg-gray-300 animate-pulse ${className}`}/>
  )
}