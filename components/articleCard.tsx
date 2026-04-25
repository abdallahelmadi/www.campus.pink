import type { Article } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"

export default function ArticleCard({
  article
}: {
  article: Article
}): React.JSX.Element {
  return (
    <Link
      href={`/articles${article.path}`}
      className={`bg-gray-100 h-70 min-w-135 max-sm:min-w-[96%]
      overflow-hidden rounded-sm relative shrink-0 group select-none`}
    >

      <Image
        src={article.image!}
        alt=""
        fill
        draggable={false}
        loading="eager"
        priority
        quality={100}
        suppressHydrationWarning
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover object-center absolute inset-0 outline-none z-0
        group-hover:scale-103 transition-transform duration-300 ease-in-out"
      />

      <div
        suppressHydrationWarning
        className="absolute left-0 bottom-0 w-full h-1/3
        bg-linear-to-t from-black/60 to-transparent"
      />

      <div
        suppressHydrationWarning
        className="absolute left-0 bottom-0 p-3
        max-w-full min-w-full flex gap-2 flex-col"
      >
        <h2 className="text-[15px] text-white font-medium truncate">
          {article.title}
        </h2>
        { article.summary && <div
          className="line-clamp-5 wrap-break-word text-white/85 text-[12px] leading-tight"
        >
          {article.summary}
        </div> }
      </div>

    </Link>
  )
}