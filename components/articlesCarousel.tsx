"use client"
import type { Article } from "@/interfaces"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import ArticleCard from "@/components/articleCard"

export default function ArticlesCarousel({
  articles
}: {
  articles: Article[]
}): React.JSX.Element {

  const [emblaRef] = useEmblaCarousel({ align: "start", loop: false }, [
    Autoplay({
      delay: 4600,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  ])

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex w-full h-full gap-2">
        {articles.map((a: Article) => (
          <ArticleCard
            article={a}
            key={a.path}
            className="min-w-185"
          />
        ))}
      </div>
    </div>
  )
}