'use server'

import { revalidatePath } from 'next/cache'
import { MissingPersonCreate } from '../../types/missingPerson.type'
import { getDB } from '@/lib/database/db'
import {
  uploadMissingPersonImages,
  deleteFile,
  parseSupabaseUrl
} from '@/lib/supabase/storage'
import { UploadedImage } from '@/components/ui/image-uploader'

export async function updateMissingPerson(
  id: string,
  data: Partial<MissingPersonCreate> & { uploadedImages?: UploadedImage[] }
) {
  try {
    const db = getDB()

    const currentPerson = await db
      .selectFrom('missingPersons')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!currentPerson) {
      throw new Error('Personne disparue non trouvée')
    }

    let imageUrls: string[] = []

    if (data.uploadedImages) {
      const existingImages = data.uploadedImages
        .filter((img) => !img.isNew)
        .map((img) => img.url)

      const newImages = data.uploadedImages.filter(
        (img) => img.isNew && img.file
      )

      if (newImages.length > 0) {
        const files = newImages.map((img) => img.file as File)
        const uploadResults = await uploadMissingPersonImages(files, id)

        const newImageUrls = uploadResults.map((result) => result.url)
        imageUrls = [...existingImages, ...newImageUrls]
      } else {
        imageUrls = existingImages
      }

      const currentImages = currentPerson.images || []
      const imagesToDelete = currentImages.filter(
        (imgUrl) => !existingImages.includes(imgUrl)
      )

      for (const imgUrl of imagesToDelete) {
        try {
          const urlInfo = await parseSupabaseUrl(imgUrl)
          if (urlInfo) {
            await deleteFile(urlInfo.path, urlInfo.bucket)
          }
        } catch (error) {
          console.error(
            `Erreur lors de la suppression de l'image ${imgUrl}:`,
            error
          )
        }
      }
    }

    const updateData: Partial<MissingPersonCreate> = {
      ...data
    }

    if (data.uploadedImages) {
      updateData.images = imageUrls
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (updateData as any).uploadedImages

    await db
      .updateTable('missingPersons')
      .set(updateData)
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
