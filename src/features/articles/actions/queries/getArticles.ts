/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'
import { getDB } from '@/lib/database/db'
import {
  ArticleRO,
  TagRO,
  ArticleStatus,
  Article
} from '../../types/articles.type'
import {
  paginatedQuery,
  PaginationResult,
  IPagination
} from '@/lib/paginatedQuery'
import { sql } from 'kysely'
import { ArticlesTable, ArticleContentStructure } from '@/lib/database/types'

interface GetArticlesOptions {
  page?: number
  limit?: number
  search?: string
  status?: ArticleStatus | ArticleStatus[]
  categoryId?: string | null
  tagId?: string
  orderBy?: keyof Pick<
    ArticlesTable,
    'title' | 'status' | 'publishedAt' | 'createdAt' | 'updatedAt'
  >
  orderDirection?: 'asc' | 'desc'
  includeCategory?: boolean
  includeTags?: boolean
  excludeCategory?: string
}

type RawArticleData = Omit<ArticlesTable, 'content'> & {
  contentJson: ArticleContentStructure | null
  categoryId?: string | null
  categoryName?: string | null
  categorySlug?: string | null
  tagsJson?: TagRO[] | string | null
}

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
    includeCategory = true,
    includeTags = true,
    excludeCategory
  } = options

  console.log('[DEBUG] getArticles called with options:', {
    page,
    limit,
    status,
    categoryId,
    tagId,
    excludeCategory
  })

  const db = getDB()
  let query = db.selectFrom('articles')

  const needsCategoryJoin = includeCategory || categoryId || search

  // --- Jointure Catégories (si nécessaire) ---
  if (needsCategoryJoin) {
    query = query.leftJoin('categories', 'categories.id', 'articles.categoryId')
  }

  const columnsToSelect: any[] = [
    'articles.id',
    'articles.title',
    'articles.slug',
    'articles.excerpt',
    'articles.coverImageUrl',
    'articles.categoryId',
    'articles.authorName',
    'articles.status',
    'articles.publishedAt',
    'articles.createdAt',
    'articles.updatedAt',
    'articles.content as content_json'
  ]

  if (includeCategory) {
    columnsToSelect.push(
      sql.ref('categories.id').as('category_id'),
      sql.ref('categories.name').as('category_name'),
      sql.ref('categories.slug').as('category_slug')
    )
  }

  if (includeTags) {
    columnsToSelect.push(
      sql<string>`(
        SELECT COALESCE(json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug, 'color', t.color)), '[]'::json)
        FROM tags t
        JOIN "article_tags" at ON t.id = at.tag_id
        WHERE at.article_id = articles.id
      )`.as('tags_json')
    )
  }

  query = query.select(columnsToSelect)

  // --- Filtres ---
  if (search && search.trim() !== '') {
    const searchTerm = `%${search.toLowerCase()}%`
    query = query.where((eb) => {
      const conditions = [
        eb('articles.title', 'ilike', searchTerm),
        eb('articles.excerpt', 'ilike', searchTerm),
        eb('articles.authorName', 'ilike', searchTerm),
        eb(sql<string>`articles.content::text`, 'ilike', searchTerm)
      ]
      if (needsCategoryJoin) {
        conditions.push(eb(sql.ref('categories.name'), 'ilike', searchTerm))
      }
      return eb.or(conditions)
    })
  }

  if (status) {
    const statuses = Array.isArray(status) ? status : [status]
    const validStatuses = statuses.filter((s): s is ArticleStatus =>
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

  if (tagId) {
    query = query.where('articles.id', 'in', (eb) =>
      eb
        .selectFrom('articleTags')
        .select('articleTags.articleId')
        .where('articleTags.tagId', '=', tagId)
    )
  }

  if (excludeCategory) {
    query = query.where('categories.slug', '!=', excludeCategory)
  }

  // --- Tri ---
  const validOrderByFields: (keyof Pick<
    ArticlesTable,
    'title' | 'status' | 'publishedAt' | 'createdAt' | 'updatedAt'
  >)[] = ['title', 'status', 'publishedAt', 'createdAt', 'updatedAt']
  const safeOrderBy = validOrderByFields.includes(orderBy)
    ? orderBy
    : 'updatedAt'
  query = query
    .orderBy(`articles.${safeOrderBy}`, orderDirection)
    .orderBy('articles.id', 'desc')

  try {
    const sqlQuery = query.compile()
    console.log('[DEBUG] Generated SQL:', sqlQuery.sql)
    console.log('[DEBUG] SQL Parameters:', sqlQuery.parameters)
  } catch (e) {
    console.error('[ERROR] Failed to compile SQL query:', e)
  }

  // --- Exécution et Formatage ---
  try {
    const results = await paginatedQuery<RawArticleData>(query, { page, limit })
    console.log(results)
    const formattedData = results.data.map((row): ArticleRO => {
      const article: Partial<Article> = {
        id: row.id,
        title: row.title,
        slug: row.slug,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        excerpt: row.excerpt ?? null,
        coverImageUrl: row.coverImageUrl ?? null,
        categoryId: row.categoryId ?? null,
        authorName: row.authorName ?? null,
        publishedAt: row.publishedAt ?? null,
        content: row.contentJson ?? {},
        category: null,
        tags: []
      }

      // Catégorie
      if (includeCategory && row.categoryId) {
        article.category = {
          id: row.categoryId,
          name: row.categoryName ?? 'Inconnu',
          slug: row.categorySlug ?? '',
          description: null,
          createdAt: '',
          updatedAt: ''
        }
      }

      // Tags
      if (includeTags && Array.isArray(row.tagsJson)) {
        article.tags = row.tagsJson[0] === null ? [] : row.tagsJson
      }

      return article as ArticleRO
    })

    return {
      data: formattedData,
      pagination: results.pagination
    }
  } catch (error) {
    console.error('Error executing paginated query for articles:', error)
    const defaultPagination: IPagination = {
      total: 0,
      page,
      limit,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
    return { data: [], pagination: defaultPagination }
  }
}

// ...
interface GetPublishedArticlesByCategoryOptions {
  page?: number
  limit?: number
  categoryId: string
}
export async function getPublishedArticlesByCategory(
  options: GetPublishedArticlesByCategoryOptions
): Promise<PaginationResult<ArticleRO>> {
  return getArticles({
    ...options,
    status: 'published',
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    includeCategory: true,
    includeTags: true
  })
}

export async function getAllPublishedArticleSlugs(): Promise<
  { slug: string; updatedAt: Date | string }[]
> {
  const db = getDB()
  try {
    const slugs = await db
      .selectFrom('articles')
      .select(['slug', 'updatedAt'])
      .where('status', '=', 'published')
      .orderBy('publishedAt', 'desc')
      .execute()
    return slugs as { slug: string; updatedAt: Date | string }[]
  } catch (error) {
    console.error('Error fetching published article slugs:', error)
    return []
  }
}
