'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'

export async function deleteTag(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Tag ID is required.' }
  }

  const db = getDB()

  try {
    await db.deleteFrom('article_tags').where('tag_id', '=', id).execute()

    const result = await db
      .deleteFrom('tags')
      .where('id', '=', id)
      .executeTakeFirst()

    if (result.numDeletedRows === undefined || result.numDeletedRows === null) {
      console.warn('numDeletedRows not returned by the dialect for tag delete.')
    } else if (BigInt(result.numDeletedRows.toString()) === BigInt(0)) {
      return { success: false, error: 'Tag not found.' }
    }

    revalidatePath('/admin/tags')

    return { success: true }
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tag.'
    }
  }
}
