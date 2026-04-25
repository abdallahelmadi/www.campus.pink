import { getArticles, getUser } from "@/actions"
import Breadcrumb from "@/components/breadcrumb"
import Header from "@/components/header"
import type { Article } from "@/interfaces"
import { notFound } from "next/navigation"
import Image from "next/image"

export default async function ArticleBySlug({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<React.JSX.Element> {

  const { slug } = await params
  const user = await getUser()

  const articles: Article[] = await getArticles()
  const article = articles.find(a => a.path === `/${slug}`)

  if (!article) return notFound()

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <Breadcrumb
          elements={[
            { href: "/articles", label: "Articles" },
            { href: `/articles/${slug}`, label: article.title }
          ]}
        />

        <div className="mt-2"/>

        <div className="relative w-full h-162 rounded-md overflow-hidden select-none mb-3">
          <Image
            src={article.image}
            alt=""
            fill
            draggable={false}
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"/>
          <div className="absolute bottom-0 left-0 w-full p-3 flex gap-3 items-center">
            <p className="text-white/70 text-[12px] line-clamp-9 leading-tight">
              {article.summary}
            </p>
          </div>
        </div>

      </main>
    </main>
  )
}