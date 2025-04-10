// src/features/articles/actions/mutations/createCategory.ts
'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import {
  categorySchema,
  CategoryFormValues
} from '../../schema/articles.schema'
import { CategoryCreate } from '../../types/articles.type'

type ValidationErrors = z.inferFlattenedErrors<
  typeof categorySchema
>['fieldErrors']

export async function createCategory(formData: CategoryFormValues): Promise<{
  success: boolean
  error?: string | ValidationErrors
  categoryId?: string
}> {
  const validation = categorySchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const { name, description } = validation.data

  try {
    const slug = await generateUniqueSlug(name, 'categories')

    const categoryData: CategoryCreate = {
      name,
      slug,
      description: description || null
    }

    const result = await db
      .insertInto('categories')
      .values(categoryData)
      .returning('id')
      .executeTakeFirst()

    if (!result?.id) {
      throw new Error('Failed to create category or retrieve ID.')
    }

    revalidatePath('/admin/categories')

    return { success: true, categoryId: result.id }
  } catch (error) {
    console.error('Error creating category:', error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create category.'
    }
  }
}
