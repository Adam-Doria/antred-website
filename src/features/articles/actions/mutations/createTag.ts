'use server'

import { revalidatePath } from 'next/cache'
import { getDB } from '@/lib/database/db'
import { generateUniqueSlug } from '@/lib/transformTextToSlug'
import { tagSchema, TagFormValues } from '../../schema/articles.schema'
import { TagCreate, TagRO } from '../../types/articles.type'

export async function createTag(
  formData: TagFormValues
): Promise<{ success: boolean; error?: string | object; tag?: TagRO }> {
  const validation = tagSchema.safeParse(formData)
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors }
  }

  const db = getDB()
  const { name, color } = validation.data

  try {
    const slug = await generateUniqueSlug(name, 'tags')

    const tagData: TagCreate = { name, slug, color }

    const result = await db
      .insertInto('tags')
      .values(tagData)
      .returningAll()
      .executeTakeFirst()

    if (!result?.id) {
      throw new Error('Failed to create tag or retrieve result.')
    }

    revalidatePath('/admin/articles/settings')

    const createdTag: TagRO = {
      id: result.id,
      name: result.name,
      slug: result.slug,
      color: result.color,
      createdAt: result.createdAt, // Kysely les retourne
      updatedAt: result.updatedAt
    }

    return { success: true, tag: createdTag }
  } catch (error) {
    console.error('Error creating tag:', error)

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tag.'
    }
  }
}
