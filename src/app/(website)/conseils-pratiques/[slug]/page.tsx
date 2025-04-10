import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug } from '@/features/articles/actions/queries/getArticleBySlug'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, UserIcon } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'
import { AspectRatio } from '@/components/ui/aspect-ratio'

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const slug = params.slug
  const article = await getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article non trouvé - Antred',
      description: 'Article non trouvé sur Antred'
    }
  }

  return {
    title: `${article.title} - Antred`,
    description: article.excerpt || `Article de Antred : ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
      url: `https://www.antred.fr/conseils-pratiques/${slug}`,
      publishedTime: article.publishedAt?.toString(),
      authors: [article.authorName || 'Antred']
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImageUrl ? [article.coverImageUrl] : []
    }
  }
}

interface ArticlePageProps {
  params: { slug: string }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const slug = params.slug
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = article?.publishedAt
    ? new Date(article?.publishedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4 pb-16">
      <article className="w-full">
        {article.coverImageUrl && (
          <div className="relative w-full aspect-[16/9] max-h-[450px] mb-12 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
            <Image
              src={article.coverImageUrl}
              alt={`Image de couverture: ${article.title}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <Link href="/conseils-pratiques" className="hover:underline">
            Conseils Pratiques
          </Link>
          <span className="mx-2">/</span>
          <span>{article.title}</span>
        </nav>

        <div className="flex justify-center gap-2 mb-6">
          {article.category && (
            <Link href={`/categories/${article.category.slug}`}>
              <Badge
                variant="outline"
                className="hover:bg-primary/10 transition-colors"
              >
                {article.category.name}
              </Badge>
            </Link>
          )}
          {article.tags &&
            article.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="hover:bg-primary/10 transition-colors"
                style={{ borderColor: tag.color, color: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
        </div>

        <header className="text-center mb-12 relative">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-center text-muted-foreground gap-5 text-sm">
            <div className="flex items-center">
              <UserIcon size={14} className="mr-1.5" />
              <span>{article.authorName || 'Antred'}</span>
            </div>
            {formattedDate && (
              <div className="flex items-center">
                <CalendarIcon size={14} className="mr-1.5" />
                <time dateTime={article.publishedAt?.toString()}>
                  {formattedDate}
                </time>
              </div>
            )}
          </div>
        </header>

        <div className="article-content prose prose-lg dark:prose-invert max-w-none">
          {article.content?.introduction && (
            <section className="mb-10 text-lg font-medium leading-relaxed text-foreground/90">
              <div
                dangerouslySetInnerHTML={{
                  __html: article.content.introduction
                }}
              />
            </section>
          )}

          {article.content?.part1 && (
            <section className="mb-10">
              <div
                dangerouslySetInnerHTML={{ __html: article.content.part1 }}
              />
            </section>
          )}

          {article.content?.quote && (
            <section className="my-12 px-6 py-4 border-l-4 border-primary/60 bg-primary/5 rounded-r-lg italic">
              <blockquote className="text-xl text-foreground/80 font-serif">
                <div
                  dangerouslySetInnerHTML={{ __html: article.content.quote }}
                />
              </blockquote>
            </section>
          )}

          {article.content?.part2 && (
            <section className="mb-10">
              <div
                dangerouslySetInnerHTML={{ __html: article.content.part2 }}
              />
            </section>
          )}

          {article.content?.images && article.content.images.length > 0 && (
            <section className="my-12 w-full">
              <Carousel className="w-full max-w-full max-h-[600px]">
                <CarouselContent className="w-full pb-4 ">
                  {article.content.images.map((imageUrl, index) => (
                    <CarouselItem
                      className="max-h-[600px] w-full overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ring-1 ring-black/5"
                      key={index}
                    >
                      <AspectRatio>
                        <Image
                          src={imageUrl}
                          alt={`Image ${index + 1} de l'article: ${article.title}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </AspectRatio>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {article.content.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-1" />
                    <CarouselNext className="right-1" />
                  </>
                )}
              </Carousel>
            </section>
          )}

          {article.content?.part3 && (
            <section className="mb-10">
              <div
                dangerouslySetInnerHTML={{ __html: article.content.part3 }}
              />
            </section>
          )}
        </div>

        <footer className="mt-16 pt-8 border-t border-border/60 text-center text-muted-foreground">
          <p className="text-sm">
            Article publié par Antred, association d&apos;aide aux personnes
            disparues à l&apos;étranger.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href="/conseils-pratiques"
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              Retour aux articles
            </Link>
            {article.category && (
              <Link
                href={`/categories/${article.category.slug}`}
                className="text-primary hover:text-primary/80 transition-colors text-sm"
              >
                Plus d&apos;articles dans {article.category.name}
              </Link>
            )}
          </div>
        </footer>
      </article>
    </main>
  )
}
