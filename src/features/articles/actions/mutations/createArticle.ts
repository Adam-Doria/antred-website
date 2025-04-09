// src/features/articles/actions/mutations/createArticle.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { articleSchema, ArticleFormValues } from '../../schema/articles.schema'
import {
  uploadFile,
  STORAGE_PRESETS,
  deleteFile,
  parseSupabaseUrl,
  uploadMultipleFiles
} from '@/lib/supabase/storage'
import { z } from 'zod'
import { handleTags } from '../../helpers/handleTags'
import { ArticleCreate } from '../../types/articles.type'

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
    uploadedCoverImage,
    uploadedImages = []
  } = validation.data

  let coverImageUrl: string | null = null
  const imagePaths: string[] = []
  let uploadedImageUrls: string[] = []

  try {
    if (uploadedCoverImage?.isNew && uploadedCoverImage.file) {
      const uploadResult = await uploadFile(
        uploadedCoverImage.file,
        STORAGE_PRESETS.articles
      )
      coverImageUrl = uploadResult.url
      imagePaths.push(uploadResult.path)
    }

    const newImagesToUpload = uploadedImages.filter(
      (img) => img.isNew && img.file
    )
    if (newImagesToUpload.length > 0) {
      const files = newImagesToUpload.map((img) => img.file as File)
      const uploadResults = await uploadMultipleFiles(
        files,
        STORAGE_PRESETS.articles
      )
      uploadedImageUrls = uploadResults.map((res) => res.url)
      imagePaths.push(...uploadResults.map((res) => res.path))
    }

    const slug = await generateUniqueSlug(title, 'articles')

    const articleData: ArticleCreate & {
      publishedAt: string | Date | null
    } = {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      coverImageUrl,
      images: uploadedImageUrls,
      categoryId: categoryId || null,
      authorName: authorName || null,
      status,
      publishedAt: status === 'published' ? new Date() : null
    }

    const result = await db.transaction().execute(async (trx) => {
      const insertedArticle = await trx
        .insertInto('articles')
        .values(articleData)
        .returning('id')
        .executeTakeFirstOrThrow()

      await handleTags(trx, insertedArticle.id, tagIds)

      return insertedArticle
    })

    revalidatePath('/admin/articles')
    if (status === 'published') {
      revalidatePath('/conseils-pratiques')
      revalidatePath(`/conseils-pratiques/${slug}`)
      revalidatePath('/sitemap.ts')
    }

    return { success: true, articleId: result.id }
  } catch (error) {
    console.error('Error creating article:', error)

    console.log('Attempting cleanup for paths:', imagePaths)
    for (const path of imagePaths) {
      const urlInfo = parseSupabaseUrl(path)
      if (urlInfo) {
        try {
          console.log(`Deleting ${urlInfo.bucket}/${urlInfo.path}`)
          await deleteFile(path, STORAGE_PRESETS.articles.bucketName)
        } catch (cleanupError) {
          console.error(
            `Failed to cleanup uploaded file ${path}:`,
            cleanupError
          )
        }
      } else {
        console.warn(`Could not parse path for cleanup: ${path}`)
      }
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create article.'
    }
  }
}
