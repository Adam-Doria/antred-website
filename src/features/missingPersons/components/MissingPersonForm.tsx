'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  MissingPersonRO,
  MissingPersonCreate
} from '../types/missingPerson.type'
import { createMissingPerson } from '@/features/missingPersons/actions/mutations/createMissingPerson'
import { updateMissingPerson } from '../actions/mutations/updateMissingPerson'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  MissingPersonFormValues,
  missingPersonSchema
} from '../schemas/missingPerson'
import { ImageDndUpload, UploadedImage } from '@/components/ui/image-uploader'

// Props du composant
interface MissingPersonFormProps {
  initialData?: MissingPersonRO | null
  onSuccess?: () => void
}

export function MissingPersonForm({
  initialData,
  onSuccess
}: MissingPersonFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditMode = !!initialData

  // Convertir les URLs d'images initiales en objets UploadedImage
  const initialImages =
    initialData?.images?.map((imageUrl) => ({
      url: imageUrl,
      isNew: false
    })) || []

  // Configuration du formulaire
  const form = useForm<MissingPersonFormValues>({
    resolver: zodResolver(missingPersonSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      gender: initialData?.gender || 'Masculin',
      disappearanceDate: initialData?.disappearanceDate
        ? new Date(initialData.disappearanceDate).toISOString().split('T')[0]
        : '',
      disappearanceLocation: initialData?.disappearanceLocation || '',
      country: initialData?.country || '',
      description: initialData?.description || '',
      latitude: initialData?.coordinates?.latitude?.toString() || '',
      longitude: initialData?.coordinates?.longitude?.toString() || '',
      images: initialImages
    }
  })

  const handleImagesChange = (images: UploadedImage[]) => {
    form.setValue('images', images, { shouldValidate: true })
  }

  // Soumission du formulaire
  const onSubmit = async (data: MissingPersonFormValues) => {
    setIsLoading(true)
    try {
      const personData: MissingPersonCreate & {
        uploadedImages?: UploadedImage[]
      } = {
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender as 'Masculin' | 'Féminin' | 'Autre',
        disappearanceDate: data.disappearanceDate,
        disappearanceLocation: data.disappearanceLocation,
        country: data.country,
        description: data.description,
        coordinates: {
          latitude: parseFloat(data.latitude || '0'),
          longitude: parseFloat(data.longitude || '0')
        },
        images: [],
        uploadedImages: data.images
      }

      if (isEditMode && initialData) {
        await updateMissingPerson(initialData.id, personData)
      } else {
        await createMissingPerson(personData)
      }

      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prénom */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Prénom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Genre */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un genre" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date de disparition */}
          <FormField
            control={form.control}
            name="disappearanceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de disparition</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Lieu de disparition */}
          <FormField
            control={form.control}
            name="disappearanceLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lieu de disparition</FormLabel>
                <FormControl>
                  <Input placeholder="Lieu de disparition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pays */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input placeholder="Pays" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="Latitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="Longitude" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageDndUpload
                  images={field.value || []}
                  onImagesChange={handleImagesChange}
                  disabled={isLoading}
                  maxFiles={5}
                  className="mt-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informations sur la disparition"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Chargement...'
              : isEditMode
                ? 'Mettre à jour'
                : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
