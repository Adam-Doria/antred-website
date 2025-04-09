'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { deleteFile, parseSupabaseUrl } from '@/lib/supabase/storage'
import { ArticleRO } from '../../types/articles.type'

export async function deleteArticle(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Article ID is required.' }
  }

  const db = getDB()

  try {
    const article = await db
      .selectFrom('articles')
      .select(['slug', 'coverImageUrl', 'images'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!article) {
      console.warn(`Article with ID ${id} not found for deletion.`)
      revalidatePath('/admin/articles')
      return { success: true }
    }
    const articleTyped = article as unknown as Pick<
      ArticleRO,
      'slug' | 'coverImageUrl' | 'images'
    >

    const deleteResult = await db
      .deleteFrom('articles')
      .where('id', '=', id)
      .executeTakeFirst()

    if (
      deleteResult.numDeletedRows === undefined ||
      deleteResult.numDeletedRows === null
    ) {
      console.warn(
        'numDeletedRows not returned by the dialect for article delete.'
      )
    } else if (BigInt(deleteResult.numDeletedRows.toString()) === BigInt(0)) {
      console.warn(`Article with ID ${id} was found but not deleted.`)
      return {
        success: false,
        error: 'Article could not be deleted from database.'
      }
    }

    const imagesToDelete: string[] = []
    if (articleTyped.coverImageUrl) {
      imagesToDelete.push(articleTyped.coverImageUrl)
    }
    if (articleTyped.images && articleTyped.images.length > 0) {
      imagesToDelete.push(...articleTyped.images)
    }

    for (const imgUrl of imagesToDelete) {
      const urlInfo = parseSupabaseUrl(imgUrl)
      if (urlInfo) {
        try {
          await deleteFile(urlInfo.path, urlInfo.bucket)
        } catch (storageError) {
          console.error(
            `Failed to delete image ${imgUrl} from storage:`,
            storageError
          )
        }
      } else {
        console.warn(`Could not parse image URL for deletion: ${imgUrl}`)
      }
    }

    revalidatePath('/admin/articles')
    revalidatePath('/conseils-pratiques')
    if (articleTyped.slug) {
      revalidatePath(`/conseils-pratiques/${articleTyped.slug}`)
    }
    revalidatePath('/sitemap.ts')

    return { success: true }
  } catch (error) {
    console.error(`Error deleting article ${id}:`, error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete article.'
    }
  }
}
