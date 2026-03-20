export default function TitleSection({
  title
}: {
  title: string
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-gray-200"/>
      <span className="text-[11px] text-gray-400 font-medium tracking-wider">
        {title}
      </span>
      <div className="h-px flex-1 bg-gray-200"/>
    </div>
  )
}