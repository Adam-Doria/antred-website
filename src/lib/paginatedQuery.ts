import { SelectQueryBuilder } from 'kysely'
import { Database } from './database/types'

export interface PaginationOption {
  page?: number | string
  limit?: number | string
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paginatedQuery = async <T extends Record<string, any>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: SelectQueryBuilder<Database, any, any>,
  options: PaginationOption = {}
): Promise<PaginationResult<T>> => {
  const page = Number(options.page || '1')
  const limit = Number(options.limit || '10')
  const offset = (page - 1) * limit

  const countQuery = query
    .clearSelect()
    .clearGroupBy()
    .clearOrderBy()
    .select((eb) => eb.fn.countAll().as('total'))

  const dataQuery = query.limit(limit).offset(offset)

  const [count, data] = await Promise.all([
    countQuery.executeTakeFirst(),
    dataQuery.execute()
  ])

  const total = Number(count?.total ?? 0)
  const totalPages = Math.ceil(total / limit)

  return {
    data: data as T[],
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    }
  }
}
