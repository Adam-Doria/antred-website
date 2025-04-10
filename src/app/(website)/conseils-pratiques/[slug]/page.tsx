import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/features/articles/actions/queries/getArticleBySlug'
import ArticleTemplate from '@/features/articles/component/ArticleTemplate'
export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
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
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4 pb-16">
      <ArticleTemplate article={article} />
    </main>
  )
}
