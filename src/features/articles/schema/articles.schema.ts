// src/features/articles/schema/articles.schema.ts
import { z } from 'zod'

const uploadedImageSchema = z.object({
  url: z.string().min(1, `L'URL de l'image est requise`),
  path: z.string().optional(),
  file: z.any().optional(),
  isUploading: z.boolean().optional(),
  isNew: z.boolean().optional()
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  description: z
    .string()
    .max(500, 'La description ne doit pas dépasser 500 caractères.')
    .nullable()
    .optional()
})
export type CategoryFormValues = z.infer<typeof categorySchema>

export const tagSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères.'),
  color: z
    .string()
    .regex(
      /^#[0-9a-fA-F]{6}$/,
      `La couleur doit être au format hexadécimal valide (ex: #RRGGBB)`
    )
    .optional()
    .default('#cccccc')
})
export type TagFormValues = z.infer<typeof tagSchema>

const articleContentSchema = z.object({
  introduction: z.string().optional().nullable(),
  part1: z.string().min(1, 'La partie 1 est requise.'),
  quote: z.string().optional().nullable(),
  part2: z.string().optional().nullable(),
  images: z.array(z.string().url()).optional().nullable().default([]),
  part3: z.string().optional().nullable(),

  uploadedCarouselImages: z
    .array(uploadedImageSchema)
    .optional()
    .nullable()
    .default([])
})

export const articleSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  content: articleContentSchema,
  excerpt: z
    .string()
    .max(300, `L'extrait ne doit pas dépasser 300 caractères.`)
    .nullable()
    .optional(),
  categoryId: z
    .string()
    .uuid('ID de catégorie invalide.')
    .nullable()
    .optional(),
  tagIds: z
    .array(z.string().uuid('ID de tag invalide.'))
    .optional()
    .default([]),
  authorName: z.string().nullable().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  uploadedCoverImage: uploadedImageSchema.optional().nullable()
})
export type ArticleFormValues = z.infer<typeof articleSchema>
