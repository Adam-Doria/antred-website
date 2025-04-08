'use server'
import { revalidatePath } from 'next/cache'
import { MissingPersonCreate } from '../../types/missingPerson.type'
import { getDB } from '@/lib/database/db'

export async function updateMissingPerson(
  id: string,
  data: Partial<MissingPersonCreate>
) {
  try {
    const db = getDB()
    await db
      .updateTable('missingPersons')
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where('id', '=', id)
      .execute()

    revalidatePath('/disparitions')
    revalidatePath('/admin/disparitions')

    return { success: true, message: 'Mise à jour réussie' }
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'ID ${id} : `, error)
    return { success: false, message: 'Échec de la mise à jour' }
  }
}
