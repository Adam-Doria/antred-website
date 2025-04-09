/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'

import { getDB } from '@/lib/database/db'
import {
  ArticleRO,
  CategoryRO,
  TagRO,
  ArticleStatus,
  Article
} from '../../types/articles.type'
import { paginatedQuery, PaginationResult } from '@/lib/paginatedQuery'
import { sql, SelectQueryBuilder, ExpressionBuilder } from 'kysely' // Importer SelectQueryBuilder et ExpressionBuilder
import { Database, ArticlesTable } from '@/lib/database/types' // Importer Database et ArticlesTable

// --- Interface d'options pour la fonction générique ---
interface GetArticlesOptions {
  page?: number
  limit?: number
  search?: string
  status?: ArticleStatus | ArticleStatus[]
  categoryId?: string | null
  tagId?: string
  // Typage plus strict pour orderBy basé sur les colonnes réelles de ArticlesTable
  orderBy?: keyof Pick<
    ArticlesTable,
    'title' | 'status' | 'publishedAt' | 'createdAt' | 'updatedAt'
  >
  orderDirection?: 'asc' | 'desc'
  includeCategory?: boolean
  includeTags?: boolean
}

// --- Fonction Principale et Générique ---
export async function getArticles(
  options: GetArticlesOptions = {}
): Promise<PaginationResult<ArticleRO>> {
  const {
    page = 1,
    limit = 15,
    search = '',
    status,
    categoryId,
    tagId,
    orderBy = 'updatedAt',
    orderDirection = 'desc',
    includeCategory = true, // Gardons true par défaut pour l'admin
    includeTags = true // Gardons true par défaut pour l'admin
  } = options

  const db = getDB()

  try {
    // Définir le type de base de la requête pour plus de clarté
    let query: SelectQueryBuilder<Database, 'articles', any> =
      db.selectFrom('articles')

    // --- Jointures Conditionnelles (appliquées avant la sélection principale) ---
    if (includeCategory || categoryId) {
      query = query.leftJoin(
        'categories',
        'categories.id',
        'articles.categoryId'
      )
    }
    if (tagId) {
      // Utiliser des alias clairs pour éviter les conflits si on joint plusieurs fois tags/articleTags
      query = query
        .innerJoin(
          'article_tags as filter_at',
          'filter_at.articleId',
          'articles.id'
        )
        .where('filter_at.tagId', '=', tagId) // Filtrer directement ici
    }

    query = query.select((eb: ExpressionBuilder<Database, any>) => {
      const articleColumns: (keyof ArticlesTable)[] = [
        'id',
        'title',
        'slug',
        'content',
        'excerpt',
        'coverImageUrl',
        'images',
        'categoryId',
        'authorName',
        'status',
        'publishedAt',
        'createdAt',
        'updatedAt'
      ]
      const selections: any[] = articleColumns.map((col) => `articles.${col}`)

      if (includeCategory) {
        selections.push(
          eb.ref('categories.id').as('category_id'),
          eb.ref('categories.name').as('category_name'),
          eb.ref('categories.slug').as('category_slug')
        )
      }

      if (includeTags) {
        selections.push(
          sql<string>`(
                        SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug, 'color', t.color))
                        FROM tags t
                        JOIN "article_tags" at ON t.id = at."tag_id"
                        WHERE at."article_id" = articles.id
                    )`.as('tags_json')
        )
      }

      return selections
    })

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.toLowerCase()}%`
      query = query.where((eb: ExpressionBuilder<Database, any>) => {
        const conditions: any[] = [
          eb('articles.title', 'ilike', searchTerm),
          eb('articles.excerpt', 'ilike', searchTerm),
          eb('articles.authorName', 'ilike', searchTerm)
        ]
        if (includeCategory) {
          conditions.push(eb('categories.name', 'ilike', searchTerm))
        }
        return eb.or(conditions)
      })
    }

    if (status) {
      const statuses = Array.isArray(status) ? status : [status]
      const validStatuses = statuses.filter((s) =>
        ['draft', 'published', 'archived'].includes(s)
      )
      if (validStatuses.length > 0) {
        query = query.where('articles.status', 'in', validStatuses)
      }
    }

    if (categoryId === null) {
      query = query.where('articles.categoryId', 'is', null)
    } else if (categoryId) {
      query = query.where('articles.categoryId', '=', categoryId)
    }

    query = query
      .orderBy(`articles.${orderBy}`, orderDirection)
      .orderBy('articles.id', 'desc')

    const results = await paginatedQuery<any>(query, { page, limit })

    const formattedData = results.data.map((row) => {
      const article: Partial<Article> = {}
      const articleKeys: (keyof ArticlesTable)[] = [
        'id',
        'title',
        'slug',
        'content',
        'excerpt',
        'coverImageUrl',
        'images',
        'categoryId',
        'authorName',
        'status',
        'publishedAt',
        'createdAt',
        'updatedAt'
      ]
      articleKeys.forEach((key) => {
        if (row[key] !== undefined) {
          ;(article as any)[key] = row[key]
        }
      })
      article.images = row.images || []
      if (row.category_id) {
        article.category = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          description: null,
          createdAt: '',
          updatedAt: ''
        } as CategoryRO
      } else {
        article.category = null
      }

      if (row.tags_json) {
        try {
          article.tags = JSON.parse(row.tags_json) as TagRO[]
        } catch (e) {
          console.error(`Failed to parse tags JSON for article ${row.id}:`, e)
          article.tags = []
        }
      } else {
        article.tags = []
      }

      return {
        ...article,
        category: article.category === undefined ? null : article.category,
        tags: article.tags === undefined ? [] : article.tags
      } as ArticleRO
    })

    return {
      data: formattedData,
      pagination: results.pagination
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new Error('Failed to fetch articles.')
  }
}

interface GetPublishedArticlesByCategoryOptions {
  page?: number
  limit?: number
  categoryId: string
}

// --- Fonction Spécifique pour le Frontend ---
export async function getPublishedArticlesByCategory(
  options: GetPublishedArticlesByCategoryOptions
): Promise<PaginationResult<ArticleRO>> {
  return getArticles({
    page: options.page,
    limit: options.limit,
    categoryId: options.categoryId,
    status: 'published',
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    includeCategory: true,
    includeTags: true
  })
}
