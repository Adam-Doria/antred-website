'use server'

import { getDB } from '@/lib/database/db'
import {
  ArticleRO,
  CategoryRO,
  TagRO,
  Article
} from '../../types/articles.type'
import { sql } from 'kysely'
import { ArticleContentStructure, ArticlesTable } from '@/lib/database/types'

export async function getArticleBySlug(
  slug: string
): Promise<ArticleRO | null> {
  if (!slug) return null

  const db = getDB()

  try {
    const result = await db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.categoryId')
      .select([
        'articles.id',
        'articles.title',
        'articles.slug',
        'articles.content',
        'articles.excerpt',
        'articles.coverImageUrl',
        'articles.categoryId',
        'articles.authorName',
        'articles.status',
        'articles.publishedAt',
        'articles.createdAt',
        'articles.updatedAt'
      ])
      .select([
        'categories.id as category_id',
        'categories.name as category_name',
        'categories.slug as category_slug',
        'categories.description as category_description',
        'categories.createdAt as category_createdAt',
        'categories.updatedAt as category_updatedAt'
      ])
      .select(() => [
        sql<string>`(
                    SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug, 'color', t.color))
                    FROM tags t
                    JOIN "article_tags" at ON t.id = at.tag_id
                    WHERE at.article_id = articles.id
                )`.as('tags_json')
      ])
      .where('articles.slug', '=', slug)
      .executeTakeFirst()

    if (!result) return null

    // Formatage
    const article: Partial<Article> = {}
    const articleKeys: (keyof Omit<ArticlesTable, 'images'>)[] = [
      'id',
      'title',
      'slug',
      'content',
      'excerpt',
      'coverImageUrl',
      'categoryId',
      'authorName',
      'status',
      'publishedAt',
      'createdAt',
      'updatedAt'
    ]
    articleKeys.forEach((key) => {
      if (result[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(article as any)[key] = result[key]
      }
    })

    if (result.category_id) {
      article.category = {
        id: result.category_id,
        name: result.category_name,
        slug: result.category_slug,
        description: result.category_description,
        createdAt: result.category_createdAt,
        updatedAt: result.category_updatedAt
      } as CategoryRO
    } else {
      article.category = null
    }

    if (result.tags_json) {
      try {
        article.tags = JSON.parse(result.tags_json) as TagRO[]
      } catch (e) {
        console.error(`Failed tags parse: ${result.id}`, e)
        article.tags = []
      }
    } else {
      article.tags = []
    }

    article.content =
      typeof result.content === 'object' && result.content !== null
        ? (result.content as ArticleContentStructure)
        : {}

    return article as ArticleRO
  } catch (error) {
    console.error(`Error fetching article by slug ${slug}:`, error)
    throw new Error(`Failed to fetch article with slug ${slug}.`)
  }
}
