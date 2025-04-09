'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tagSchema, TagFormValues } from '../schema/articles.schema'
import { createTag } from '../actions/mutations/createTag'
import { updateTag } from '../actions/mutations/updateTag'
import { TagRO } from '../types/articles.type'
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
import { useRouter } from 'next/navigation'

interface TagFormProps {
  initialData?: TagRO | null
  onSuccess?: () => void // Pour fermer la modale
}

export function TagForm({ initialData, onSuccess }: TagFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!initialData
  const router = useRouter()

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || ''
    }
  })

  const onSubmit = async (data: TagFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      let result
      if (isEditMode && initialData) {
        result = await updateTag(initialData.id, data)
      } else {
        result = await createTag(data)
      }

      if (result.success) {
        form.reset()
        onSuccess?.()
        router.refresh()
      } else {
        if (typeof result.error === 'string') {
          setError(result.error)
        } else if (result.error && typeof result.error === 'object') {
          const firstError = Object.values(result.error)[0]?.[0]
          setError(firstError || 'Erreur de validation.')
        } else {
          setError('Une erreur inconnue est survenue.')
        }
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du Tag</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Japon, Sécurité, Juridique"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Chargement...'
              : isEditMode
                ? 'Mettre à jour Tag'
                : 'Créer Tag'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
