/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely'
import { missingPersonData } from '@/features/missingPersons/missingPerson'
import { Database } from '../types'

export async function up(db: Kysely<Database>): Promise<void> {
  console.log('Importation des données de personnes disparues...')

  for (const person of missingPersonData) {
    try {
      const missingPerson = {
        firstName: person.firstName,
        lastName: person.lastName,
        gender: person.gender,
        birthDate: person.birthdate,
        disappearanceDate: person.disappearanceDate,
        disappearanceLocation: person.disappearanceLocation || 'Inconnu',
        country: person.country,
        coordinates: person.coordinates,
        description: person.description,
        images: person.images
      }
      await db
        .insertInto('missingPersons')
        .values(missingPerson)
        .onConflict((conflict) =>
          conflict.columns(['lastName', 'firstName']).doUpdateSet(missingPerson)
        )
        .execute()

      console.log(`✅ Importé: ${person.firstName} ${person.lastName}`)
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'importation de ${person.firstName} ${person.lastName}:`,
        error,
        '\nPropriétés:',
        JSON.stringify(person, null, 2)
      )
    }
  }

  console.log('Importation terminée!')
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.deleteFrom('missingPersons').execute()
  console.log('Toutes les données importées ont été supprimées')
}
