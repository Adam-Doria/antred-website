'use server'

import { getDB } from '@/lib/database/db'
import { revalidatePath } from 'next/cache'

export async function deleteMissingPerson(id: string) {
  try {
    const db = getDB()
    await db.deleteFrom('missingPersons').where('id', '=', id).execute()

    revalidatePath('/disparitions')
    revalidatePath('/admin/disparitions')

    return { success: true, message: 'Suppression réussie' }
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'ID ${id} : `, error)
    return { success: false, message: 'Échec de la suppression' }
  }
}
