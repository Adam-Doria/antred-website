'use server'

import { getDB } from '@/lib/database/db'
import { TagRO } from '../../types/articles.type'
import { paginatedQuery, PaginationResult } from '@/lib/paginatedQuery'

interface GetTagsOptions {
  page?: number
  limit?: number
  search?: string
  orderBy?: keyof TagRO
  orderDirection?: 'asc' | 'desc'
}

export async function getTags(
  options: GetTagsOptions = {}
): Promise<PaginationResult<TagRO>> {
  const {
    page = 1,
    limit = 20,
    search = '',
    orderBy = 'name',
    orderDirection = 'asc'
  } = options

  const db = getDB()

  try {
    let query = db.selectFrom('tags').selectAll()

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.toLowerCase()}%`
      query = query.where((eb) =>
        eb.or([
          eb('name', 'ilike', searchTerm),
          eb('slug', 'ilike', searchTerm)
        ])
      )
    }

    query = query.orderBy(orderBy, orderDirection)

    const results = await paginatedQuery<TagRO>(query, { page, limit })
    return results
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to fetch tags.')
  }
}

export async function getAllTags(): Promise<TagRO[]> {
  const db = getDB()
  try {
    const tags = await db
      .selectFrom('tags')
      .selectAll()
      .orderBy('name', 'asc')
      .execute()
    return tags
  } catch (error) {
    console.error('Error fetching all tags:', error)
    throw new Error('Failed to fetch all tags.')
  }
}

export async function getTagById(id: string): Promise<TagRO | null> {
  if (!id) return null
  const db = getDB()
  try {
    const tag = await db
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return tag || null
  } catch (error) {
    console.error(`Error fetching tag by ID ${id}:`, error)
    throw new Error(`Failed to fetch tag with ID ${id}.`)
  }
}
