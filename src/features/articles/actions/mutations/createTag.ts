'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { tagSchema, TagFormValues } from '../../schema/articles.schema'
import { TagCreate } from '../../types/articles.type'

export async function createTag(
  formData: TagFormValues
): Promise<{ success: boolean; error?: string | object; tagId?: string }> {
  const validation = tagSchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const { name } = validation.data

  try {
    const slug = await generateUniqueSlug(name, 'tags')

    const tagData: TagCreate = { name, slug }

    const result = await db
      .insertInto('tags')
      .values(tagData)
      .returning('id')
      .executeTakeFirst()

    if (!result?.id) {
      throw new Error('Failed to create tag or retrieve ID.')
    }

    revalidatePath('/admin/tags') // Chemin admin (à créer)

    return { success: true, tagId: result.id }
  } catch (error) {
    console.error('Error creating tag:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tag.'
    }
  }
}
