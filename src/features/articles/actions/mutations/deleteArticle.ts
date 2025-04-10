'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { deleteFile, parseSupabaseUrl } from '@/lib/supabase/storage'
import { ArticleContentStructure } from '@/lib/database/types'
import { getCategoryById as fetchCategoryById } from '../queries/getCategories'

export async function deleteArticle(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'Article ID is required.' }
  }

  const db = getDB()

  try {
    const articleToDelete = await db
      .selectFrom('articles')
      .select(['slug', 'coverImageUrl', 'content', 'categoryId'])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!articleToDelete) {
      console.warn(
        `[deleteArticle] Article with ID ${id} not found. Assuming already deleted or invalid ID.`
      )
      return { success: true }
    }

    console.log(`[deleteArticle] Deleting article ${id} from database.`)
    const deleteResult = await db
      .deleteFrom('articles')
      .where('id', '=', id)
      .executeTakeFirst()

    if (
      deleteResult.numDeletedRows === undefined ||
      deleteResult.numDeletedRows === null
    ) {
      console.warn(
        '[deleteArticle] numDeletedRows not returned by the dialect.'
      )
    } else if (BigInt(deleteResult.numDeletedRows.toString()) === BigInt(0)) {
      console.warn(
        `[deleteArticle] Article ${id} found but not deleted from DB.`
      )
      return {
        success: false,
        error: 'Article could not be deleted from database.'
      }
    }
    console.log(
      `[deleteArticle] Article ${id} successfully deleted from database.`
    )

    // --- Suppression des images du stockage ---
    const imagesToDeleteUrls: string[] = []
    if (articleToDelete.coverImageUrl) {
      imagesToDeleteUrls.push(articleToDelete.coverImageUrl)
    }

    // Extraire les URLs du contenu JSONB
    try {
      const contentData = articleToDelete.content as
        | ArticleContentStructure
        | null
        | undefined
      if (contentData?.images && Array.isArray(contentData.images)) {
        imagesToDeleteUrls.push(
          ...contentData.images.filter((url) => typeof url === 'string')
        )
      }
    } catch (parseError) {
      console.error(
        `[deleteArticle] Failed to parse content JSONB for article ${id} to extract images:`,
        parseError
      )
    }

    if (imagesToDeleteUrls.length > 0) {
      console.log(
        `[deleteArticle] Deleting ${imagesToDeleteUrls.length} images from storage for article ${id}:`,
        imagesToDeleteUrls
      )
      const deletePromises = imagesToDeleteUrls.map(async (imgUrl) => {
        const urlInfo = parseSupabaseUrl(imgUrl)
        if (urlInfo) {
          try {
            await deleteFile(urlInfo.path, urlInfo.bucket)
          } catch (storageError) {
            console.error(
              `[deleteArticle] Failed to delete image ${imgUrl} from storage:`,
              storageError
            )
          }
        } else {
          console.warn(
            `[deleteArticle] Could not parse image URL for deletion: ${imgUrl}`
          )
        }
      })
      await Promise.all(deletePromises)
      console.log(
        `[deleteArticle] Finished attempting image deletions for article ${id}.`
      )
    } else {
      console.log(
        `[deleteArticle] No images found to delete from storage for article ${id}.`
      )
    }

    // --- Revalidation ---
    console.log(
      `[deleteArticle] Revalidating paths after deleting article ${id}`
    )
    const category = articleToDelete.categoryId
      ? await fetchCategoryById(articleToDelete.categoryId)
      : null

    const pathsToRevalidate = new Set<string>()
    pathsToRevalidate.add('/admin/articles/settings')
    if (category?.slug)
      pathsToRevalidate.add(`/admin/articles/${category.slug}`)

    if (articleToDelete.slug)
      pathsToRevalidate.add(`/articles/${articleToDelete.slug}`)

    pathsToRevalidate.add('/conseils-pratiques')
    pathsToRevalidate.add('/paroles-dexpert')
    pathsToRevalidate.add('/actualites-de-lantred')
    pathsToRevalidate.add('/sitemap.ts')

    console.log(`[deleteArticle] Revalidating:`, Array.from(pathsToRevalidate))
    Array.from(pathsToRevalidate).forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (error) {
    console.error(`[deleteArticle] Error deleting article ${id}:`, error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to delete article.'
    }
  }
}
