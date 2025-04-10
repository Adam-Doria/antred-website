'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { articleSchema, ArticleFormValues } from '../../schema/articles.schema'
import {
  uploadFile,
  STORAGE_PRESETS,
  deleteFile,
  uploadMultipleFiles
} from '@/lib/supabase/storage'
import { z } from 'zod'
import { handleTags } from '../../helpers/handleTags'
import { ArticleContentStructure, Database } from '@/lib/database/types'
import { InsertObject } from 'kysely'
import { getCategoryById as fetchCategoryById } from '../queries/getCategories'

type ValidationErrors = z.inferFlattenedErrors<
  typeof articleSchema
>['fieldErrors']

export async function createArticle(formData: ArticleFormValues): Promise<{
  success: boolean
  error?: string | ValidationErrors
  articleId?: string
}> {
  const validation = articleSchema.safeParse(formData)
  if (!validation.success) {
    console.error('Validation failed:', validation.error.flatten().fieldErrors)
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const {
    title,
    content,
    excerpt,
    categoryId,
    tagIds = [],
    authorName,
    status,
    uploadedCoverImage
  } = validation.data

  console.log('[createArticle] Received tagIds:', tagIds)

  let coverImageUrl: string | null = null
  let coverImagePath: string | null = null
  const carouselImagePaths: string[] = []
  let finalCarouselImageUrls: string[] = []
  let insertedArticleId: string | null = null
  let finalSlug: string | null = null

  try {
    // --- 1. Générer Slug (besoin pour l'insert) ---
    const slug = await generateUniqueSlug(title, 'articles')
    finalSlug = slug

    // --- 2. Préparer les données initiales pour l'insert ---
    const initialContentObject: ArticleContentStructure = {
      introduction: content.introduction || null,
      part1: content.part1 || '',
      quote: content.quote || null,
      part2: content.part2 || null,
      images: null,
      part3: content.part3 || null
    }

    const articleDataToInsert: Omit<
      InsertObject<Database, 'articles'>,
      'coverImageUrl' | 'content'
    > = {
      title,
      slug,
      excerpt: excerpt || null,
      categoryId: categoryId || null,
      authorName: authorName || null,
      status,
      publishedAt: status === 'published' ? new Date() : null
    }

    // --- 3. Transaction pour insérer l'article de base et les tags ---
    await db.transaction().execute(async (trx) => {
      console.log('[createArticle TX] Inserting article base data...')
      const baseArticle = await trx
        .insertInto('articles')
        .values({
          ...articleDataToInsert,
          content: JSON.stringify(initialContentObject),
          coverImageUrl: null
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      insertedArticleId = baseArticle.id
      console.log(
        `[createArticle TX] Article base inserted with ID: ${insertedArticleId}`
      )

      console.log(
        `[createArticle TX] Calling handleTags for article ${insertedArticleId} with tagIds:`,
        tagIds
      )
      await handleTags(trx, insertedArticleId, tagIds)
      console.log(
        `[createArticle TX] handleTags completed for article ${insertedArticleId}`
      )

      return baseArticle
    })
    console.log(
      `[createArticle] Base article and tags transaction finished for ${insertedArticleId}`
    )

    const uploadPromises: Promise<void>[] = []

    // Upload Image Couverture
    if (uploadedCoverImage?.isNew && uploadedCoverImage.file) {
      console.log(
        `[createArticle] Uploading cover image for article ${insertedArticleId}`
      )
      uploadPromises.push(
        uploadFile(
          uploadedCoverImage.file,
          STORAGE_PRESETS.articles,
          insertedArticleId
        )
          .then((result) => {
            coverImageUrl = result.url
            coverImagePath = result.path
            console.log(
              `[createArticle] Cover image uploaded: ${coverImageUrl}`
            )
          })
          .catch((err) => {
            console.error(`[createArticle] Cover image upload failed`, err)
            throw err
          })
      )
    }

    // Upload Images Carrousel
    const newCarouselImagesToUpload =
      content.uploadedCarouselImages?.filter((img) => img.isNew && img.file) ||
      []
    if (newCarouselImagesToUpload.length > 0) {
      console.log(
        `[createArticle] Uploading ${newCarouselImagesToUpload.length} carousel images for article ${insertedArticleId}`
      )
      const files = newCarouselImagesToUpload.map((img) => img.file as File)
      uploadPromises.push(
        uploadMultipleFiles(files, STORAGE_PRESETS.articles, insertedArticleId)
          .then((uploadResults) => {
            finalCarouselImageUrls = uploadResults.map((res) => res.url)
            carouselImagePaths.push(...uploadResults.map((res) => res.path))
            console.log(
              `[createArticle] Carousel images uploaded:`,
              finalCarouselImageUrls
            )
          })
          .catch((err) => {
            console.error(`[createArticle] Carousel images upload failed`, err)
            if (carouselImagePaths.length > 0) {
              console.log(
                `[createArticle Cleanup] Deleting partially uploaded carousel images after error...`
              )
              Promise.all(
                carouselImagePaths.map((p) =>
                  deleteFile(p, STORAGE_PRESETS.articles.bucketName)
                )
              ).catch((cleanupErr) =>
                console.error(
                  'Error during carousel image cleanup:',
                  cleanupErr
                )
              )
            }
            if (coverImagePath) {
              console.log(
                `[createArticle Cleanup] Deleting cover image after subsequent carousel error...`
              )
              deleteFile(
                coverImagePath,
                STORAGE_PRESETS.articles.bucketName
              ).catch((cleanupErr) =>
                console.error('Error during cover image cleanup:', cleanupErr)
              )
            }
            throw err
          })
      )
    }

    await Promise.all(uploadPromises)
    console.log(
      `[createArticle] All image uploads completed for article ${insertedArticleId}`
    )

    // --- 5. Mise à jour finale de l'article avec les URLs des images ---
    const finalContentWithImages = {
      ...initialContentObject,
      images: finalCarouselImageUrls.length > 0 ? finalCarouselImageUrls : null
    }

    console.log(
      `[createArticle] Updating article ${insertedArticleId} with final image URLs and content`
    )
    await db
      .updateTable('articles')
      .set({
        coverImageUrl: coverImageUrl,
        content: JSON.stringify(finalContentWithImages)
      })
      .where('id', '=', insertedArticleId)
      .executeTakeFirstOrThrow()
    console.log(
      `[createArticle] Final update completed for article ${insertedArticleId}`
    )

    // --- 6. Revalidation ---
    console.log(
      `[createArticle] Revalidating paths for article ${insertedArticleId}`
    )
    const category = categoryId ? await fetchCategoryById(categoryId) : null

    const pathsToRevalidate = new Set<string>()
    pathsToRevalidate.add('/admin/articles/settings')
    if (category?.slug)
      pathsToRevalidate.add(`/admin/articles/${category.slug}`)
    if (status === 'published' && finalSlug) {
      pathsToRevalidate.add(`/articles/${finalSlug}`)
      pathsToRevalidate.add('/conseils-pratiques')
      pathsToRevalidate.add('/paroles-dexpert')
      pathsToRevalidate.add('/actualites-de-lantred')
      pathsToRevalidate.add('/sitemap.ts')
    }
    console.log(`[createArticle] Revalidating:`, Array.from(pathsToRevalidate))
    Array.from(pathsToRevalidate).forEach((path) => revalidatePath(path))

    return { success: true, articleId: insertedArticleId }
  } catch (error) {
    console.error(
      '[createArticle] Error during article creation process:',
      error
    )

    if (insertedArticleId) {
      console.log(
        `[createArticle Error Cleanup] Attempting to delete article ${insertedArticleId} and uploaded images due to error.`
      )
      const pathsToCleanup = [
        ...(coverImagePath ? [coverImagePath] : []),
        ...carouselImagePaths
      ]
      if (pathsToCleanup.length > 0) {
        await Promise.all(
          pathsToCleanup.map((path) =>
            deleteFile(path, STORAGE_PRESETS.articles.bucketName)
          )
        ).catch((cleanupErr) =>
          console.error('Error during final image cleanup:', cleanupErr)
        )
      }
      try {
        await db
          .deleteFrom('articles')
          .where('id', '=', insertedArticleId)
          .execute()
        console.log(
          `[createArticle Error Cleanup] Deleted incomplete article ${insertedArticleId}`
        )
      } catch (dbDeleteError) {
        console.error(
          `[createArticle Error Cleanup] Failed to delete article ${insertedArticleId} from DB:`,
          dbDeleteError
        )
      }
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create article.'
    }
  }
}
