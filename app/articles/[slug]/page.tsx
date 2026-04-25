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

  console.log(slug, article)

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

        <div className="relative w-full h-192 rounded-md overflow-hidden select-none mb-3">
          <Image
            src={article.image}
            alt=""
            fill
            draggable={false}
            priority
            quality={100}
            sizes="(max-width: 768px) 100vw, 860px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"/>
        </div>

      </main>
    </main>
  )
}


//           <div
//             className={`absolute bottom-0 left-0 w-full p-3 flex gap-3
//             ${!service.description ? "items-center" : "items-start"}`}
//           >
//             <div className="shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
//               <Image
//                 src={service.logo!}
//                 alt=""
//                 width={46}
//                 height={46}
//                 draggable={false}
//                 quality={100}
//                 className="object-cover object-center w-full h-full"
//               />
//             </div>
//             <div className="flex flex-col gap-0.5 min-w-0">
//               <h1 className="text-white text-[16px] font-bold truncate">
//                 {service.name}
//               </h1>
//               <p className="text-white/70 text-[12px] line-clamp-2 leading-tight">
//                 {service.description}
//               </p>
//             </div>
//           </div>