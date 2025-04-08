'use server'
import { getDB } from '@/lib/database/db'
import { MissingPersonCreate } from '../../types/missingPerson.type'
import { revalidatePath } from 'next/cache'

export async function createMissingPerson(missingPerson: MissingPersonCreate) {
  const db = getDB()
  try {
    await db
      .insertInto('missingPersons')
      .values(missingPerson)
      .executeTakeFirst()

    revalidatePath('/disparitions')
    revalidatePath('/admin/disparitions')

    return { success: 'ok' }
  } catch (error) {
    console.error(
      `Error trying to create ${missingPerson.firstName} ${missingPerson.lastName} : `,
      error
    )
    throw new Error('fail to create missing person')
  }
}
