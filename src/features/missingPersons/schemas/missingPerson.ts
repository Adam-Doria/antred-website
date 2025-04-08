import { z } from 'zod'

const uploadedImageSchema = z.object({
  url: z.string().min(1, `L'URL de l'image est requise`),
  path: z.string().optional(),
  file: z.any().optional(),
  isUploading: z.boolean().optional(),
  isNew: z.boolean().optional()
})

export const missingPersonSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit comporter au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  gender: z.enum(['Masculin', 'Féminin', 'Autre']),
  disappearanceDate: z.string().min(1, 'La date est requise'),
  disappearanceLocation: z.string().min(2, 'Le lieu de disparition est requis'),
  country: z.string().min(2, 'Le pays est requis'),
  description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  imageUrl: z.string().optional(),
  images: z.array(uploadedImageSchema).optional()
})

export type MissingPersonFormValues = z.infer<typeof missingPersonSchema>
