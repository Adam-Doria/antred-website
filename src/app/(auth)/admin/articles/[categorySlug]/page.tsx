import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchBar } from '@/components/searchBar/SearchBar'
import { ArticlesTable } from '@/features/articles/component/ArticleTable'
import { CreateArticleButton } from '@/features/articles/component/CreateArticleButton'
import { ArticleStatusFilter } from '@/features/articles/component/ArticleStatusFilter'
import { notFound } from 'next/navigation'
import {
  ArticleRO,
  ArticleStatus
} from '@/features/articles/types/articles.type'
import {
  getAllCategories,
  getCategoryBySlug
} from '@/features/articles/actions/queries/getCategories'
import { getAllTags } from '@/features/articles/actions/queries/getTags'
import { getArticles } from '@/features/articles/actions/queries/getArticles'

export const dynamic = 'force-dynamic'

interface CategoryArticlesPageProps {
  params: { categorySlug: string }
  searchParams: Promise<{
    q?: string
    page?: string
    limit?: string
    sort?: string
    status?: string
  }>
}

async function CategoryArticlesPage({
  params,
  searchParams: searchParamsPromise
}: CategoryArticlesPageProps) {
  const { categorySlug } = await params
  const searchParams = await searchParamsPromise

  const searchQuery = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)
  const limit = parseInt(searchParams.limit || '15', 10)
  const statusParam = searchParams.status
  const status = ['draft', 'published', 'archived'].includes(statusParam ?? '')
    ? (statusParam as ArticleStatus)
    : undefined
  const sortParam = searchParams.sort?.split(':')

  const orderBy =
    (sortParam?.[0] as keyof Pick<
      ArticleRO,
      'title' | 'status' | 'publishedAt' | 'createdAt' | 'updatedAt'
    >) || 'updatedAt'
  const orderDirection = (sortParam?.[1] as 'asc' | 'desc') || 'desc'

  const [category, availableCategories, availableTags] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getAllCategories(),
    getAllTags()
  ])

  if (!category) {
    notFound()
  }

  const { data: articles, pagination } = await getArticles({
    page,
    limit,
    search: searchQuery,
    categoryId: category.id,
    status: status,
    orderBy: orderBy,
    orderDirection: orderDirection,
    includeCategory: false,
    includeTags: true
  })
  console.log(articles)
  const basePath = `/admin/articles/${categorySlug}`

  return (
    <div className="space-y-6 p-4 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles : {category.name}</h1>
          <p className="text-secondary-foreground">
            Gérez ici les articles de la catégorie {category.name}.
          </p>
        </div>
        <CreateArticleButton
          categoryId={category.id}
          categoryName={category.name}
          availableCategories={availableCategories}
          availableTags={availableTags}
        />
      </div>

      <div className="py-2 flex items-center justify-between gap-4">
        <SearchBar
          initialQuery={searchQuery}
          placeholder={`Rechercher dans "${category.name}"...`}
          className="w-full max-w-sm"
        />
        <ArticleStatusFilter currentStatus={status} basePath={basePath} />
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <ArticlesTable
          data={articles}
          pagination={pagination}
          basePath={basePath}
        />
      </Suspense>
    </div>
  )
}

export default CategoryArticlesPage
