import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArticleCard } from '@/features/articles/component/ArticleCards'
import { getArticles } from '@/features/articles/actions/queries/getArticles'
import { getCategoryBySlug } from '@/features/articles/actions/queries/getCategories'

export const metadata: Metadata = {
  title: 'Conseils pratiques - Antred',
  description: `Conseils·et·articles·pratiques·pour·les·familles·confrontées·à·la·disparition·d'un·proche·à·l'étranger.`
}

const ARTICLES_LIMIT_PER_SECTION = 4

export default async function PracticalAdvicePage() {
  const t = await getTranslations('practicalAdvice')

  const expertCategory = await getCategoryBySlug('paroles-dexperts')
  const expertCategoryId = expertCategory?.id || null

  const expertArticlesResult = await getArticles({
    limit: ARTICLES_LIMIT_PER_SECTION,
    categoryId: expertCategoryId,
    status: 'published',
    orderBy: 'publishedAt',
    orderDirection: 'desc'
  })
  const expertArticles = expertArticlesResult.data || []

  const otherArticlesResult = await getArticles({
    limit: 100,
    status: 'published',
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    excludeCategory: 'paroles-dexperts'
  })
  const otherArticles = otherArticlesResult.data || []

  return (
    <main className="items-center overflow-hidden justify-between pt-24 px-4 ">
      <div className="w-full rounded-lg bg-brand-radial p-4 sm:p-6 md:p-8 relative">
        <div className="relative">
          <h2
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            className="text-dark-foreground mb-4 text-center"
          />
          <p className="text-lg text-dark-secondaryForeground text-center mb-4 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[150px] -left-[150px] w-[250px] h-[250px] border-2 border-white/10 rounded-full" />
          <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-[100px] -right-[100px] w-[200px] h-[200px] border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-[100px] -right-[100px] w-[250px] h-[250px] border-2 border-white/10 rounded-full" />
        </div>
      </div>

      <section className="w-full space-y-3 mt-8">
        <h2> {t('firstSection.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <section className="w-full space-y-3 my-8">
        <h2 className="">{t('secondSection.title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {expertArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  )
}
