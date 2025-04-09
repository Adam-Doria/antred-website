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

export const articleSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères.'),
  content: z
    .string()
    .min(10, 'Le contenu doit contenir au moins 10 caractères.'),
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

  uploadedCoverImage: uploadedImageSchema.optional().nullable(),
  uploadedImages: z.array(uploadedImageSchema).optional().default([])
})
export type ArticleFormValues = z.infer<typeof articleSchema>
