// src/features/articles/actions/queries/getArticleBySlug.ts
'use server'
import { getDB } from '@/lib/database/db'
import {
  Article,
  ArticleRO,
  CategoryRO,
  TagRO
} from '../../types/articles.type'
import { sql } from 'kysely'

export async function getArticleBySlug(
  slug: string
): Promise<ArticleRO | null> {
  // ... (validation slug) ...
  const db = getDB()
  try {
    const result = await db
      .selectFrom('articles')
      .leftJoin('categories', 'categories.id', 'articles.categoryId')
      .select([
        /* ... champs article ... */ 'articles.id',
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
        /* ... champs catégorie aliasés ... */ 'categories.id as category_id',
        'categories.name as category_name',
        'categories.slug as category_slug',
        'categories.description as category_description',
        'categories.createdAt as category_createdAt',
        'categories.updatedAt as category_updatedAt'
      ])
      .select(() => [
        sql<string>`(SELECT json_agg(t.*) FROM tags t JOIN "articleTags" at ON t.id = at."tagId" WHERE at."articleId" = articles.id)`.as(
          'tags_json'
        )
      ])
      .where('articles.slug', '=', slug)
      .executeTakeFirst()

    // ... (Formatage du résultat comme précédemment pour créer `articleData`) ...
    if (!result) return null

    const articleData: Article = {
      /* ... construction objet ... */ id: result.id,
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
      /* ... ajouter catégorie ... */
      articleData.category = {
        id: result.category_id,
        name: result.category_name,
        slug: result.category_slug,
        description: result.category_description,
        createdAt: result.category_createdAt,
        updatedAt: result.category_updatedAt
      } as CategoryRO
    }
    if (result.tags_json) {
      /* ... parser/ajouter tags ... */
      try {
        articleData.tags = JSON.parse(result.tags_json) as TagRO[]
      } catch (e) {
        articleData.tags = []
      }
    }

    return articleData as ArticleRO
  } catch (error) {
    // ... (gestion erreur) ...
    console.error(`Error fetching article by slug ${slug}:`, error)
    throw new Error(`Failed to fetch article with slug ${slug}.`)
  }
}
