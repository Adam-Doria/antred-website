'use server'

import { getDB } from '@/lib/database/db'
import { MissingPersonCreate } from '../../types/missingPerson.type'
import { revalidatePath } from 'next/cache'
import { uploadMissingPersonImages } from '@/lib/supabase/storage'
import { UploadedImage } from '@/components/ui/image-uploader'

export async function createMissingPerson(
  missingPerson: MissingPersonCreate & { uploadedImages?: UploadedImage[] }
) {
  const db = getDB()
  try {
    let imageUrls: string[] = []

    if (
      missingPerson.uploadedImages &&
      missingPerson.uploadedImages.length > 0
    ) {
      const newImages = missingPerson.uploadedImages.filter(
        (img) => img.isNew && img.file
      )

      if (newImages.length > 0) {
        const files = newImages.map((img) => img.file as File)
        const uploadResults = await uploadMissingPersonImages(files)

        const newImageUrls = uploadResults.map((result) => result.url)
        imageUrls = [...imageUrls, ...newImageUrls]
      }

      const existingImageUrls = missingPerson.uploadedImages
        .filter((img) => !img.isNew)
        .map((img) => img.url)

      imageUrls = [...imageUrls, ...existingImageUrls]
    }

    const personData: MissingPersonCreate = {
      firstName: missingPerson.firstName,
      lastName: missingPerson.lastName,
      gender: missingPerson.gender,
      birthDate: missingPerson.birthDate,
      disappearanceDate: missingPerson.disappearanceDate,
      disappearanceLocation: missingPerson.disappearanceLocation,
      country: missingPerson.country,
      coordinates: missingPerson.coordinates,
      description: missingPerson.description,
      images: imageUrls
    }

    await db.insertInto('missingPersons').values(personData).executeTakeFirst()

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
