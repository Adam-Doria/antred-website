/* eslint-disable @typescript-eslint/no-explicit-any */
// src/features/articles/actions/queries/getArticles.ts
'use server'
import { getDB } from '@/lib/database/db'
import { ArticleRO, CategoryRO, TagRO } from '../../types/articles.type'
import { paginatedQuery, PaginationResult } from '@/lib/paginatedQuery'
import { sql } from 'kysely'
import { Database } from '@/lib/database/types' // Assurez-vous que Database est importé

interface GetArticlesByCategoryOptions {
  page?: number
  limit?: number
  categoryId: string // Rendre categoryId requis pour cette fonction
  // Statut publié implicite pour les vues publiques
}

export async function getPublishedArticlesByCategory(
  options: GetArticlesByCategoryOptions
): Promise<PaginationResult<ArticleRO>> {
  const { page = 1, limit = 10, categoryId } = options
  const db = getDB()

  try {
    const query = db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.categoryId') // Jointure pour filtrer ET récupérer les infos
      .select([
        // Sélectionner les champs nécessaires pour la liste
        'articles.id',
        'articles.title',
        'articles.slug',
        'articles.excerpt',
        'articles.coverImageUrl',
        'articles.authorName',
        'articles.status',
        'articles.publishedAt',
        'articles.createdAt',
        'articles.updatedAt',
        'articles.categoryId',
        // Champs catégorie aliasés
        'categories.id as category_id',
        'categories.name as category_name',
        'categories.slug as category_slug'
      ])
      .select(() => [
        // Récupérer les tags pour affichage
        sql<string>`(SELECT json_agg(t.*) FROM tags t JOIN "articleTags" at ON t.id = at."tagId" WHERE at."articleId" = articles.id)`.as(
          'tags_json'
        )
      ])
      .where('articles.categoryId', '=', categoryId)
      .where('articles.status', '=', 'published') // Filtrer par statut publié
      .orderBy('articles.publishedAt', 'desc') // Trier par date de publication
      .orderBy('articles.id', 'desc')

    const results = await paginatedQuery<any>(query, { page, limit })

    // Formatage (similaire à getArticleBySlug, mais sans le 'content' complet)
    const formattedData = results.data.map((row) => {
      const articleData: any = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        coverImageUrl: row.coverImageUrl,
        authorName: row.authorName,
        status: row.status,
        publishedAt: row.publishedAt,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        categoryId: row.categoryId,
        category: null,
        tags: []
      }
      if (row.category_id) {
        articleData.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug
          // Pas besoin de tous les champs ici, juste ce qui est utile pour la carte/liste
        } as Partial<CategoryRO>
      }
      if (row.tags_json) {
        try {
          // On peut ne parser que le nom/slug pour la liste
          const fullTags = JSON.parse(row.tags_json) as TagRO[]
          articleData.tags = fullTags.map((t) => ({
            name: t.name,
            slug: t.slug
          }))
        } catch (e) {
          articleData.tags = []
        }
      }
      return articleData as ArticleRO
    })

    return {
      data: formattedData,
      pagination: results.pagination
    }
  } catch (error) {
    console.error(`Error fetching articles for category ${categoryId}:`, error)
    throw new Error(`Failed to fetch articles for category ${categoryId}.`)
  }
}

// OPTIONNEL : Une fonction pour l'admin qui a plus de filtres
export async function getAllArticlesForAdmin(
  options: {
    page?: number
    limit?: number
    search?: string
    status?:
      | 'draft'
      | 'published'
      | 'archived'
      | ('draft' | 'published' | 'archived')[]
    categoryId?: string | null
    orderBy?: keyof Database['articles']
    orderDirection?: 'asc' | 'desc'
  } = {}
): Promise<PaginationResult<ArticleRO>> {
  // Implémentation similaire à la version précédente de getArticles
  // mais sans la jointure/agrégation complexe des tags par défaut,
  // sauf si demandée spécifiquement via une option.
  const {
    page = 1,
    limit = 15,
    search = '',
    status,
    categoryId,
    orderBy = 'updatedAt',
    orderDirection = 'desc'
  } = options
  const db = getDB()

  try {
    let query = db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.categoryId')
      .selectAll('articles') // Sélection simple pour l'admin par défaut
      .select(['categories.name as category_name']) // Récupérer juste le nom de la catégorie

    // --- Appliquer les filtres (status, categoryId, search) ---
    if (search) {
      /* ... where clause ... */
      const searchTerm = `%${search.toLowerCase()}%`
      query = query.where((eb) =>
        eb.or([eb('articles.title', 'ilike', searchTerm) /* , etc */])
      )
    }
    if (status) {
      /* ... where clause ... */
      const statuses = Array.isArray(status) ? status : [status]
      if (statuses.length > 0) {
        query = query.where('articles.status', 'in', statuses)
      }
    }
    if (categoryId === null) {
      query = query.where('articles.categoryId', 'is', null)
    } else if (categoryId) {
      query = query.where('articles.categoryId', '=', categoryId)
    }

    // --- Tri ---
    query = query
      .orderBy(`articles.${orderBy}`, orderDirection)
      .orderBy('articles.id', 'desc')

    const results = await paginatedQuery<any>(query, { page, limit })

    // Formatage simple pour l'admin
    const formattedData = results.data.map((row) => ({
      ...row,
      category: row.category_name ? { name: row.category_name } : null, // Juste le nom pour l'admin
      tags: [] // Pas de chargement des tags par défaut pour l'admin
    })) as ArticleRO[]

    return { data: formattedData, pagination: results.pagination }
  } catch (error) {
    console.error('Error fetching articles for admin:', error)
    throw new Error('Failed to fetch articles for admin.')
  }
}
