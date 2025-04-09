// src/features/articles/actions/mutations/updateArticle.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { articleSchema, ArticleFormValues } from '../../schema/articles.schema'
import { ArticleRO, ArticleUpdate } from '../../types/articles.type'
import {
  uploadFile,
  deleteFile,
  STORAGE_PRESETS,
  parseSupabaseUrl,
  uploadMultipleFiles
} from '@/lib/supabase/storage'
import { z } from 'zod'
import { handleTags } from '../../helpers/handleTags'

type ValidationErrors = z.inferFlattenedErrors<
  typeof articleSchema
>['fieldErrors']

export async function updateArticle(
  id: string,
  formData: ArticleFormValues
): Promise<{ success: boolean; error?: string | ValidationErrors }> {
  if (!id) {
    return { success: false, error: 'Article ID is required.' }
  }

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

  let newCoverImageUrl: string | null = null
  let coverImageToDelete: string | null = null
  let finalImageUrls: string[] = []
  const imagePathsToCreate: string[] = []
  const imagesToDelete: string[] = []

  try {
    // 1. Récupérer l'article actuel
    const currentArticle = await db
      .selectFrom('articles')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()

    if (!currentArticle) {
      return { success: false, error: 'Article not found.' }
    }
    const currentArticleTyped = currentArticle as unknown as ArticleRO

    if (uploadedCoverImage) {
      if (uploadedCoverImage.isNew && uploadedCoverImage.file) {
        const uploadResult = await uploadFile(
          uploadedCoverImage.file,
          STORAGE_PRESETS.articles
        )
        newCoverImageUrl = uploadResult.url
        imagePathsToCreate.push(uploadResult.path)
        if (currentArticleTyped.coverImageUrl) {
          coverImageToDelete = currentArticleTyped.coverImageUrl
        }
      } else if (!uploadedCoverImage.url && currentArticleTyped.coverImageUrl) {
        coverImageToDelete = currentArticleTyped.coverImageUrl
        newCoverImageUrl = null // S'assurer qu'elle est bien mise à null dans la DB
      } else {
        newCoverImageUrl =
          uploadedCoverImage.url || currentArticleTyped.coverImageUrl
      }
    } else if (currentArticleTyped.coverImageUrl) {
      coverImageToDelete = currentArticleTyped.coverImageUrl
      newCoverImageUrl = null
    } else {
      newCoverImageUrl = currentArticleTyped.coverImageUrl
    }

    const existingImageUrls = uploadedImages
      .filter((img) => !img.isNew)
      .map((img) => img.url)
    const newImagesToUpload = uploadedImages.filter(
      (img) => img.isNew && img.file
    )

    if (newImagesToUpload.length > 0) {
      const files = newImagesToUpload.map((img) => img.file as File)
      const uploadResults = await uploadMultipleFiles(
        files,
        STORAGE_PRESETS.articles
      )
      const newUploadedUrls = uploadResults.map((res) => res.url)
      imagePathsToCreate.push(...uploadResults.map((res) => res.path))
      finalImageUrls = [...existingImageUrls, ...newUploadedUrls]
    } else {
      finalImageUrls = existingImageUrls
    }

    const currentImages = currentArticleTyped.images || []
    currentImages.forEach((imgUrl) => {
      if (!finalImageUrls.includes(imgUrl)) {
        imagesToDelete.push(imgUrl)
      }
    })

    const articleUpdateData: ArticleUpdate & {
      publishedAt: string | Date | null
    } = {
      title,
      content,
      excerpt: excerpt || null,
      coverImageUrl: newCoverImageUrl,
      images: finalImageUrls,
      categoryId: categoryId || null,
      authorName: authorName || null,
      status,
      // Mettre à jour publishedAt seulement si on passe à 'published' et qu'il n'y était pas
      publishedAt:
        status === 'published' && currentArticleTyped.status !== 'published'
          ? new Date()
          : status === 'published'
            ? currentArticleTyped.publishedAt
            : null
    }

    // 5. Générer un nouveau slug si le titre a changé
    if (currentArticleTyped.title !== title) {
      articleUpdateData.slug = await generateUniqueSlug(title, 'articles', id)
    }

    await db.transaction().execute(async (trx) => {
      await trx
        .updateTable('articles')
        .set(articleUpdateData)
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      await handleTags(trx, id, tagIds)
    })

    if (coverImageToDelete) {
      const urlInfo = parseSupabaseUrl(coverImageToDelete)
      if (urlInfo) {
        await deleteFile(urlInfo.path, urlInfo.bucket)
      }
    }
    for (const imgUrl of imagesToDelete) {
      const urlInfo = parseSupabaseUrl(imgUrl)
      if (urlInfo) {
        await deleteFile(urlInfo.path, urlInfo.bucket)
      }
    }

    revalidatePath('/admin/articles')
    revalidatePath('/conseils-pratiques')

    if (currentArticleTyped.slug !== articleUpdateData.slug) {
      revalidatePath(`/conseils-pratiques/${currentArticleTyped.slug}`)
      if (articleUpdateData.slug) {
        revalidatePath(`/conseils-pratiques/${articleUpdateData.slug}`)
      }
    } else {
      revalidatePath(`/conseils-pratiques/${currentArticleTyped.slug}`)
    }
    revalidatePath('/sitemap.ts')

    return { success: true }
  } catch (error) {
    console.error(`Error updating article ${id}:`, error)

    console.log(
      'Attempting cleanup for newly created paths:',
      imagePathsToCreate
    )
    for (const path of imagePathsToCreate) {
      try {
        console.log(`Deleting ${STORAGE_PRESETS.articles.bucketName}/${path}`)
        await deleteFile(path, STORAGE_PRESETS.articles.bucketName)
      } catch (cleanupError) {
        console.error(
          `Failed to cleanup newly uploaded file ${path}:`,
          cleanupError
        )
      }
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to update article.'
    }
  }
}
