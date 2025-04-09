// src/features/articles/actions/queries/getArticleById.ts
'use server'

import { getDB } from '@/lib/database/db'
import {
  Article,
  ArticleRO,
  CategoryRO,
  TagRO
} from '../../types/articles.type'
import { sql } from 'kysely'

export async function getArticleById(id: string): Promise<ArticleRO | null> {
  if (!id) {
    return null
  }

  const db = getDB()

  try {
    // Requête similaire à getArticleBySlug, mais filtre par ID
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
        'articles.images',
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
                    SELECT json_agg(t.*)
                    FROM tags t
                    JOIN "article_tags" at ON t.id = at."tag_id"
                    WHERE at."article_id" = articles.id
                )`.as('tags_json')
      ])
      .where('articles.id', '=', id) // Filtre par ID ici
      .executeTakeFirst()

    if (!result) {
      return null
    }

    const article: Article = {
      id: result.id,
      title: result.title,
      slug: result.slug,
      content: result.content,
      excerpt: result.excerpt,
      coverImageUrl: result.coverImageUrl,
      images: result.images || [],
      categoryId: result.categoryId,
      authorName: result.authorName,
      status: result.status,
      publishedAt: result.publishedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      category: null,
      tags: []
    }

    if (result.category_id) {
      article.category = {
        id: result.category_id,
        name: result.category_name,
        slug: result.category_slug,
        description: result.category_description,
        createdAt: result.category_createdAt,
        updatedAt: result.category_updatedAt
      } as CategoryRO
    }

    if (result.tags_json) {
      try {
        article.tags = result.tags_json
          ? (JSON.parse(result.tags_json) as TagRO[])
          : []
      } catch (e) {
        console.error(`Failed to parse tags JSON for article ${result.id}:`, e)
        article.tags = []
      }
    } else {
      article.tags = []
    }

    return article as ArticleRO
  } catch (error) {
    console.error(`Error fetching article by ID ${id}:`, error)
    throw new Error(`Failed to fetch article with ID ${id}.`)
  }
}
