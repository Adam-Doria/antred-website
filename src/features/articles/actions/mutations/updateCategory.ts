'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import {
  categorySchema,
  CategoryFormValues
} from '../../schema/articles.schema'
import { CategoryUpdate } from '../../types/articles.type'

export async function updateCategory(
  id: string,
  formData: CategoryFormValues
): Promise<{ success: boolean; error?: string | object }> {
  if (!id) {
    return { success: false, error: 'Category ID is required.' }
  }

  const validation = categorySchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const { name, description } = validation.data

  try {
    const currentCategory = await db
      .selectFrom('categories')
      .select('name')
      .where('id', '=', id)
      .executeTakeFirst()

    if (!currentCategory) {
      return { success: false, error: 'Category not found.' }
    }

    const categoryUpdateData: CategoryUpdate = {
      name,
      description: description || null
    }

    if (currentCategory.name !== name) {
      categoryUpdateData.slug = await generateUniqueSlug(name, 'categories', id)
    }

    const result = await db
      .updateTable('categories')
      .set(categoryUpdateData)
      .where('id', '=', id)
      .executeTakeFirst()

    if (result.numUpdatedRows === undefined || result.numUpdatedRows === null) {
      console.warn(
        'numUpdatedRows not returned by the dialect for category update.'
      )
    } else if (BigInt(result.numUpdatedRows.toString()) === BigInt(0)) {
      console.log('No changes detected for category update.')
    }

    revalidatePath('/admin/categories')

    return { success: true }
  } catch (error) {
    console.error(`Error updating category ${id}:`, error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update category.'
    }
  }
}
