import { getDB } from '@/lib/database/db'
import { MissingPersonCreate } from '../../types/missingPerson.type'

const db = getDB()
export const createMissingPerson = async (
  missingPerson: MissingPersonCreate
) => {
  try {
    await db
      .insertInto('missingPersons')
      .values(missingPerson)
      .executeTakeFirst()

    return { success: 'ok' }
  } catch (error) {
    console.error(
      `Error trying to create ${missingPerson.firstName} ${missingPerson.lastName} : `,
      error
    )
    throw new Error('fail to create missing person')
  }
}
