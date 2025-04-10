'use server'

import { getDB } from '@/lib/database/db'
import { CategoryRO } from '../../types/articles.type'
import { paginatedQuery, PaginationResult } from '@/lib/paginatedQuery'

interface GetCategoriesOptions {
  page?: number
  limit?: number
  search?: string
  orderBy?: keyof CategoryRO
  orderDirection?: 'asc' | 'desc'
}

export async function getCategories(
  options: GetCategoriesOptions = {}
): Promise<PaginationResult<CategoryRO>> {
  const {
    page = 1,
    limit = 20,
    search = '',
    orderBy = 'name',
    orderDirection = 'asc'
  } = options

  const db = getDB()

  try {
    let query = db.selectFrom('categories').selectAll()

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.toLowerCase()}%`
      query = query.where((eb) =>
        eb.or([
          eb('name', 'ilike', searchTerm),
          eb('slug', 'ilike', searchTerm),
          eb('description', 'ilike', searchTerm)
        ])
      )
    }

    query = query.orderBy(orderBy, orderDirection)

    const results = await paginatedQuery<CategoryRO>(query, { page, limit })
    return results
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories.')
  }
}

export async function getAllCategories(): Promise<CategoryRO[]> {
  const db = getDB()
  try {
    const categories = await db
      .selectFrom('categories')
      .selectAll()
      .orderBy('name', 'asc')
      .execute()
    return categories
  } catch (error) {
    console.error('Error fetching all categories:', error)
    throw new Error('Failed to fetch all categories.')
  }
}

export async function getCategoryById(id: string): Promise<CategoryRO | null> {
  if (!id) return null
  const db = getDB()
  try {
    const category = await db
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return category || null
  } catch (error) {
    console.error(`Error fetching category by ID ${id}:`, error)
    throw new Error(`Failed to fetch category with ID ${id}.`)
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryRO | null> {
  if (!slug) return null
  const db = getDB()
  try {
    const category = await db
      .selectFrom('categories')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst()
    return category ? (category as CategoryRO) : null
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error)
    return null
  }
}
