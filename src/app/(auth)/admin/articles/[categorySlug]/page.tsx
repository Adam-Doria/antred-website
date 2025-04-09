// src/app/(auth)/admin/articles/[categorySlug]/page.tsx
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchBar } from '@/components/searchBar/SearchBar'
import { ArticlesTable } from '@/features/articles/component/ArticleTable'
import { CreateArticleButton } from '@/features/articles/component/CreateArticleButton'

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
  searchParams?: {
    q?: string
    page?: string
    limit?: string
    sort?: string
    status?: ArticleStatus
  }
}

async function CategoryArticlesPage({
  params,
  searchParams
}: CategoryArticlesPageProps) {
  const { categorySlug } = params
  const searchQuery = searchParams?.q || ''
  const page = parseInt(searchParams?.page || '1', 10)
  const limit = parseInt(searchParams?.limit || '15', 10)
  const status = searchParams?.status
  const sortParam = searchParams?.sort?.split(':')

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

  // --- Appel à la fonction getArticles générique ---
  const { data: articles, pagination } = await getArticles({
    page,
    limit,
    search: searchQuery,
    categoryId: category.id, // Toujours filtrer par la catégorie de la page
    status: status ? status : undefined, // Appliquer le filtre de statut s'il existe
    orderBy: orderBy,
    orderDirection: orderDirection,
    includeCategory: false, // Pas besoin de recharger la catégorie ici
    includeTags: true // Charger les tags pour l'affichage table
  })

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

      {/* --- Barre de recherche et Filtre Statut --- */}
      <div className="py-2 flex items-center justify-between gap-4">
        <SearchBar
          initialQuery={searchQuery}
          placeholder={`Rechercher dans "${category.name}"...`}
          className="w-full max-w-sm"
        />
        {/* --- Sélecteur de Statut --- */}
        {/* TODO: Implémenter ce composant qui met à jour le searchParam 'status' */}
        {/* Exemple simple :
                 <Select value={status || 'all'} onValueChange={(newStatus) => updateStatusFilter(newStatus === 'all' ? '' : newStatus)}>
                      <SelectTrigger className="w-[180px]"> <SelectValue placeholder="Filtrer par statut..." /> </SelectTrigger>
                      <SelectContent>
                           <SelectItem value="all">Tous les statuts</SelectItem>
                           <SelectItem value="published">Publié</SelectItem>
                           <SelectItem value="draft">Brouillon</SelectItem>
                           <SelectItem value="archived">Archivé</SelectItem>
                      </SelectContent>
                 </Select>
                 */}
        <div>[Filtre Statut Placeholder]</div>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <ArticlesTable
          data={articles}
          pagination={pagination}
          basePath={basePath}
          searchQuery={searchQuery}
          statusFilter={status}
        />
      </Suspense>
    </div>
  )
}

export default CategoryArticlesPage
