import { z } from 'zod'

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
  imageUrl: z.string().optional()
})

export type MissingPersonFormValues = z.infer<typeof missingPersonSchema>
