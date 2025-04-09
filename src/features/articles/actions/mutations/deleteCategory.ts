'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Category ID is required.' }
  }

  const db = getDB()

  try {
    const result = await db
      .deleteFrom('categories')
      .where('id', '=', id)
      .executeTakeFirst()

    if (result.numDeletedRows === undefined || result.numDeletedRows === null) {
      console.warn(
        'numDeletedRows not returned by the dialect for category delete.'
      )
    } else if (BigInt(result.numDeletedRows.toString()) === BigInt(0)) {
      return { success: false, error: 'Category not found.' }
    }

    revalidatePath('/admin/categories')

    return { success: true }
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error)

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete category.'
    }
  }
}
