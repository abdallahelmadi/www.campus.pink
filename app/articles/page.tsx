import Header from "@/components/header"
import Footer from "@/components/footer"
import Empty from "@/components/empty"
import { getUser, getArticles } from "@/actions"
import ArticleCard from "@/components/articleCard"
import Breadcrumb from "@/components/breadcrumb"

export default async function Articles(): Promise<React.JSX.Element> {

  const user = await getUser()
  const articles = await getArticles(26)

  return (
    <main className="flex flex-col items-center gap-4 w-full p-2 mt-14">
      <main className="max-w-340 w-full flex flex-col gap-1">

        <Header user={user} />

        <div className="flex flex-col">

          <Breadcrumb
            elements={[
              { href: "/articles", label: "Articles" }
            ]}
          />

          <div className="mt-2"/>

          <span className="text-black font-medium">
            Latest Articles
          </span>

          <div className="mt-1"/>

          { articles.length === 0 ? (
            <Empty>
              No articles available at the moment<br/>
              Please check back later
            </Empty>
          ): (
            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
              {articles.map(article => (
                <ArticleCard
                  key={article.path}
                  article={article}
                  longDescription
                  className="h-80! min-w-full! max-sm:min-w-full!"
                />
              ))}
            </div>
          )}

        </div>

        <Footer />

      </main>
    </main>
  )
}