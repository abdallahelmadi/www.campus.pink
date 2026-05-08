import { getArticles, getUser } from "@/actions"
import Breadcrumb from "@/components/breadcrumb"
import Header from "@/components/header"
import { notFound } from "next/navigation"
import Image from "next/image"
import Footer from "@/components/footer"
import type { Article } from "@/interfaces"

export default async function ArticleBySlug({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<React.JSX.Element> {

  const { slug } = await params
  const user = await getUser()

  const articles: Article[] = await getArticles(32)
  const article = articles.find(a => a.path === `/${slug}`)

  if (!article) return notFound()

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gray-50">
      <main className="w-full">

        <Header user={user} />

        <div className="relative w-full h-125 md:h-145 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            draggable={false}
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"/>
          <div className="absolute inset-0 flex flex-col justify-end items-center p-2">
            <h1 className="text-white text-2xl md:text-3xl font-medium leading-6.5 md:leading-8.5 mb-2 line-clamp-4 max-w-340">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full p-2 mt-2">
          <article className="max-w-340 w-full flex flex-col gap-6 bg-white rounded-sm p-4 md:p-6 border border-gray-200">

            <Breadcrumb
              elements={[
                { href: "/articles", label: "Articles" },
                { href: `/articles/${slug}`, label: article.title }
              ]}
            />

            <div className="flex flex-col gap-6">
              <div 
                className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-700 prose-p:leading-8
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-img:rounded-lg prose-img:my-6
                prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </div>

          </article>

          <Footer />
        </div>

      </main>
    </main>
  )
}