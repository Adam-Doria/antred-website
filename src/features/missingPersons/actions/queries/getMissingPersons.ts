import { getDB } from '@/lib/database/db'
import { MissingPersonRO } from '../../types/missingPerson.type'
import { paginatedQuery, PaginationResult } from '@/lib/paginatedQuery'

const db = getDB()

//Améliorations futures
// Ajouter des filtres:
//-Creer un type MissingPerson filter
//-Appliquer les filtres sur la querry

export const getMissingPerson = async ({
  page,
  limit,
  order = 'asc',
  search = ''
}: {
  page: number
  limit: number
  order?: 'asc' | 'desc'
  search?: string
}): Promise<PaginationResult<MissingPersonRO>> => {
  try {
    let baseQuery = db
      .selectFrom('missingPersons')
      .selectAll()
      .orderBy('disappearanceDate', order)

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.toLowerCase()}%`

      baseQuery = baseQuery.where((eb) =>
        eb.or([
          eb('firstName', 'ilike', searchTerm),
          eb('lastName', 'ilike', searchTerm),
          eb('country', 'ilike', searchTerm)
        ])
      )
    }

    const results = await paginatedQuery<MissingPersonRO>(baseQuery, {
      page,
      limit
    })

    return results
  } catch (error) {
    console.error('Error while fetching all missing persons:', error)
    throw new Error('Failed to Fetch all missing persons')
  }
}

export const getMissingPersonById = async (
  id: string
): Promise<MissingPersonRO | undefined> => {
  try {
    const query = await db
      .selectFrom('missingPersons')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    return query
  } catch (error) {
    console.error('Error impossible to fetch Missing Person by Id', error)
    throw new Error(`Failed to fetch missing person with id: ${id}`)
  }
}
