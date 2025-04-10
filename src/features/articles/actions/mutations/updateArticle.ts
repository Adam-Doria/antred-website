'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { articleSchema, ArticleFormValues } from '../../schema/articles.schema'
import {
  uploadFile,
  deleteFile,
  STORAGE_PRESETS,
  parseSupabaseUrl,
  uploadMultipleFiles,
  UploadResult
} from '@/lib/supabase/storage'
import { z } from 'zod'
import { handleTags } from '../../helpers/handleTags'
import { ArticleContentStructure, Database } from '@/lib/database/types'
import { UpdateObject } from 'kysely'
import { getCategoryById as fetchCategoryById } from '../queries/getCategories'

type ValidationErrors = z.inferFlattenedErrors<
  typeof articleSchema
>['fieldErrors']

export async function updateArticle(
  id: string,
  formData: ArticleFormValues
): Promise<{
  success: boolean
  error?: string | ValidationErrors
}> {
  if (!id) return { success: false, error: 'Article ID is required.' }

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

  console.log(`[updateArticle] Received tagIds for article ${id}:`, tagIds)

  let newCoverImageUrl: string | null = null
  let newCoverImagePath: string | null = null
  let coverImageToDeletePath: string | null = null
  const carouselImagePathsToCreate: string[] = []
  const carouselImageUrlsToDelete: string[] = []
  let finalCarouselImageUrls: string[] = []

  try {
    const currentArticle = await db
      .selectFrom('articles')
      .select([
        'title',
        'slug',
        'status',
        'publishedAt',
        'coverImageUrl',
        'content',
        'categoryId'
      ])
      .where('id', '=', id)
      .executeTakeFirst()

    if (!currentArticle) return { success: false, error: 'Article not found.' }

    const currentContent =
      (currentArticle.content as ArticleContentStructure) || {}
    const currentCoverImageUrl = currentArticle.coverImageUrl
    const currentCarouselImageUrls = currentContent.images || []

    // --- Gestion Image Couverture ---
    if (uploadedCoverImage) {
      if (uploadedCoverImage.isNew && uploadedCoverImage.file) {
        const uploadResult = await uploadFile(
          uploadedCoverImage.file,
          STORAGE_PRESETS.articles,
          id
        )
        newCoverImageUrl = uploadResult.url
        newCoverImagePath = uploadResult.path
        if (currentCoverImageUrl) {
          const parsed = parseSupabaseUrl(currentCoverImageUrl)
          if (parsed) coverImageToDeletePath = parsed.path
        }
      } else if (!uploadedCoverImage.url && currentCoverImageUrl) {
        const parsed = parseSupabaseUrl(currentCoverImageUrl)
        if (parsed) coverImageToDeletePath = parsed.path
        newCoverImageUrl = null
      } else {
        newCoverImageUrl = uploadedCoverImage.url || currentCoverImageUrl
      }
    } else if (currentCoverImageUrl) {
      const parsed = parseSupabaseUrl(currentCoverImageUrl)
      if (parsed) coverImageToDeletePath = parsed.path
      newCoverImageUrl = null
    } else {
      newCoverImageUrl = null
    }

    // --- Gestion Images Carrousel ---
    const existingCarouselUrls =
      content.uploadedCarouselImages
        ?.filter((img) => !img.isNew && img.url)
        .map((img) => img.url) || []
    const newCarouselImagesToUpload =
      content.uploadedCarouselImages?.filter((img) => img.isNew && img.file) ||
      []

    let newUploadedUrls: string[] = []
    if (newCarouselImagesToUpload.length > 0) {
      const files = newCarouselImagesToUpload.map((img) => img.file as File)
      const uploadResults: UploadResult[] = await uploadMultipleFiles(
        files,
        STORAGE_PRESETS.articles,
        id
      )
      newUploadedUrls = uploadResults.map((res) => res.url)
      carouselImagePathsToCreate.push(...uploadResults.map((res) => res.path))
    }
    finalCarouselImageUrls = [...existingCarouselUrls, ...newUploadedUrls]
    currentCarouselImageUrls.forEach((url) => {
      if (!finalCarouselImageUrls.includes(url)) {
        carouselImageUrlsToDelete.push(url)
      }
    })
    const finalContentObject: ArticleContentStructure = {
      introduction: content.introduction || null,
      part1: content.part1 || '',
      quote: content.quote || null,
      part2: content.part2 || null,
      images: finalCarouselImageUrls.length > 0 ? finalCarouselImageUrls : null,
      part3: content.part3 || null
    }

    const articleUpdateData: UpdateObject<Database, 'articles'> = {
      title,
      content: JSON.stringify(finalContentObject),
      excerpt: excerpt || null,
      coverImageUrl: newCoverImageUrl,
      categoryId: categoryId || null,
      authorName: authorName || null,
      status,
      publishedAt:
        status === 'published' && currentArticle.status !== 'published'
          ? new Date()
          : status === 'published'
            ? currentArticle.publishedAt
            : null
    }

    if (currentArticle.title !== title) {
      articleUpdateData.slug = await generateUniqueSlug(title, 'articles', id)
    }

    // --- Transaction Database ---
    await db.transaction().execute(async (trx) => {
      console.log(`[updateArticle TX] Updating article ${id}`)
      await trx
        .updateTable('articles')
        .set(articleUpdateData)
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      console.log(
        `[updateArticle TX] Calling handleTags for article ${id} with tagIds:`,
        tagIds
      )
      await handleTags(trx, id, tagIds)
      console.log(`[updateArticle TX] handleTags completed for article ${id}`)
    })
    console.log(
      `[updateArticle] Transaction finished successfully for article ${id}`
    )

    // --- Nettoyage des ANCIENNES images APRÈS succès DB ---
    const pathsToDeleteAfterSuccess: { path: string; bucket: string }[] = []
    if (coverImageToDeletePath) {
      pathsToDeleteAfterSuccess.push({
        path: coverImageToDeletePath,
        bucket: STORAGE_PRESETS.articles.bucketName
      })
    }
    carouselImageUrlsToDelete.forEach((url) => {
      const parsed = parseSupabaseUrl(url)
      if (parsed) pathsToDeleteAfterSuccess.push(parsed)
    })

    if (pathsToDeleteAfterSuccess.length > 0) {
      console.log(
        '[updateArticle] Deleting old images from storage:',
        pathsToDeleteAfterSuccess
      )
      await Promise.all(
        pathsToDeleteAfterSuccess.map((item) =>
          deleteFile(item.path, item.bucket)
        )
      ).catch((err) => console.error('Error during old image cleanup:', err))
    }

    // --- Revalidation ---
    console.log(`[updateArticle] Revalidating paths for article ${id}`)
    const currentCategory = currentArticle.categoryId
      ? await fetchCategoryById(currentArticle.categoryId)
      : null
    const newCategory = categoryId ? await fetchCategoryById(categoryId) : null

    const pathsToRevalidate = new Set<string>()
    pathsToRevalidate.add('/admin/articles/settings')
    if (currentCategory?.slug)
      pathsToRevalidate.add(`/admin/articles/${currentCategory.slug}`)
    if (newCategory?.slug && newCategory.slug !== currentCategory?.slug)
      pathsToRevalidate.add(`/admin/articles/${newCategory.slug}`)

    if (currentArticle.slug)
      pathsToRevalidate.add(`/articles/${currentArticle.slug}`)
    const finalSlug = articleUpdateData.slug || currentArticle.slug
    if (finalSlug) pathsToRevalidate.add(`/articles/${finalSlug}`)

    pathsToRevalidate.add('/conseils-pratiques')
    pathsToRevalidate.add('/paroles-dexpert')
    pathsToRevalidate.add('/actualites-de-lantred')
    pathsToRevalidate.add('/sitemap.ts')

    console.log(`[updateArticle] Revalidating:`, Array.from(pathsToRevalidate))
    Array.from(pathsToRevalidate).forEach((path) => revalidatePath(path))

    return { success: true }
  } catch (error) {
    console.error(`[updateArticle] Error updating article ${id}:`, error)

    const cleanupPathsOnError = [...carouselImagePathsToCreate]
    if (newCoverImagePath) {
      cleanupPathsOnError.push(newCoverImagePath)
    }

    if (cleanupPathsOnError.length > 0) {
      console.log(
        `[updateArticle Error Cleanup] Attempting to delete newly uploaded files:`,
        cleanupPathsOnError
      )
      const bucket = STORAGE_PRESETS.articles.bucketName
      await Promise.all(
        cleanupPathsOnError.map((path) => deleteFile(path, bucket))
      ).catch((err) =>
        console.error(
          'Failed to cleanup newly uploaded files after error:',
          err
        )
      )
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update article.'
    }
  }
}
