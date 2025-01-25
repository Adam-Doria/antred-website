import ArticleCards from '@/components/system/cards/ArticleCards'
import { useTranslations } from 'next-intl'
import { articles, parolesExpert } from './article'

export default function Page() {
  const t = useTranslations('practicalAdvice')
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4 ">
      <div className="w-full rounded-lg bg-brand-radial p-4 sm:p-6 md:p-8 relative">
        <div className="relative">
          <h2
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            className="text-dark-foreground mb-4 text-center"
          ></h2>
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
      <section className="w-full space-y-3">
        <h2> {t('firstSection.title')}</h2>
        <div className="flex flex-wrap gap-4 h-[450x] items-start ">
          {articles.map((article) => (
            <ArticleCards key={article.id} {...article} />
          ))}
        </div>
      </section>
      <section className="w-full space-y-3">
        <h2 className="">{t('secondSection.title')}</h2>
        <div className="flex basis-1/4 gap-4 h-[450x] items-start ">
          {parolesExpert.map((article) => (
            <ArticleCards key={article.id} {...article} />
          ))}
        </div>
      </section>
    </main>
  )
}
