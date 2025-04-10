'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { tagSchema, TagFormValues } from '../../schema/articles.schema'
import { TagUpdate } from '../../types/articles.type'

export async function updateTag(
  id: string,
  formData: TagFormValues
): Promise<{ success: boolean; error?: string | object }> {
  if (!id) {
    return { success: false, error: 'Tag ID is required.' }
  }

  const validation = tagSchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const { name, color } = validation.data

  try {
    const currentTag = await db
      .selectFrom('tags')
      .select('name')
      .where('id', '=', id)
      .executeTakeFirst()

    if (!currentTag) {
      return { success: false, error: 'Tag not found.' }
    }

    const tagUpdateData: TagUpdate = { name, color }

    if (currentTag.name !== name) {
      tagUpdateData.slug = await generateUniqueSlug(name, 'tags', id)
    }

    const result = await db
      .updateTable('tags')
      .set(tagUpdateData)
      .where('id', '=', id)
      .executeTakeFirst()

    if (result.numUpdatedRows === undefined || result.numUpdatedRows === null) {
      console.warn('numUpdatedRows not returned by the dialect for tag update.')
    } else if (BigInt(result.numUpdatedRows.toString()) === BigInt(0)) {
      console.log('No changes detected for tag update.')
    }

    revalidatePath('/admin/tags')

    return { success: true }
  } catch (error) {
    console.error(`Error updating tag ${id}:`, error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tag.'
    }
  }
}
