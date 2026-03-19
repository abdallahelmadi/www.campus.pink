import { IconChevronRightSmall } from "@/icons"
import Link from "next/link"

export default function Breadcrumb({
  elements
}: {
  elements: { href: string; label: string }[]
}): React.JSX.Element {
  return (
    <nav className="flex items-center gap-1 text-[12px] text-gray-400">
      <Link
        href="/"
        className="hover:text-black transition duration-200 ease-in-out"
      >
        Home
      </Link>
      {elements.map<React.JSX.Element>((ele, index) => (
        index === elements.length - 1 ? (
          <div
            key={index}
            className="flex items-center gap-1"
          >
            <IconChevronRightSmall size={12} color="#9ca3af" />
            <span className="text-black font-medium truncate max-w-40">
              {ele.label.slice(0, 12) + (ele.label.length > 12 ? ".." : "")}
            </span>
          </div>
        ) : (
          <div
            key={index}
            className="flex items-center gap-1"
          >
            <IconChevronRightSmall size={12} color="#9ca3af" />
            <Link
              href={ele.href}
              className="hover:text-black transition duration-200 ease-in-out"
            >
              {ele.label.slice(0, 12) + (ele.label.length > 12 ? ".." : "")}
            </Link>
          </div>
        )
      ))}
    </nav>
  )
}