// src/features/articles/components/ArticleForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { articleSchema, ArticleFormValues } from '../schema/articles.schema'
import {
  ArticleRO,
  CategoryRO,
  TagRO,
  ArticleStatus
} from '../types/articles.type'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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
import { ImageDndUpload, UploadedImage } from '@/components/ui/image-uploader'
import { Loader2 } from 'lucide-react'
import { RichTextEditor } from '@/components/ui/richTextEditor'
import { createArticle } from '../actions/mutations/createArticle'
import { updateArticle } from '../actions/mutations/updateArticle'
import { MultiSelectTags } from './MultiSelectTag'

interface ArticleFormProps {
  initialData?: ArticleRO | null
  initialCategoryId?: string | null
  availableCategories: CategoryRO[]
  availableTags: TagRO[]
  onSuccess?: () => void
}

const statusOptions: { value: ArticleStatus; label: string }[] = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
  { value: 'archived', label: 'Archivé' }
]

export function ArticleForm({
  initialData,
  initialCategoryId,
  availableCategories,
  onSuccess,
  availableTags
}: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!initialData
  const router = useRouter()

  const initialCoverImage = initialData?.coverImageUrl
    ? [{ url: initialData.coverImageUrl, isNew: false }]
    : []
  const initialContentImages =
    initialData?.images?.map((url) => ({ url, isNew: false })) || []

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '<p></p>',
      excerpt: initialData?.excerpt || '',
      categoryId:
        !isEditMode && initialCategoryId
          ? initialCategoryId
          : initialData?.categoryId || null,
      tagIds: initialData?.tags?.map((tag) => tag.id) || [],
      authorName: initialData?.authorName || '',
      status: initialData?.status || 'draft',
      uploadedCoverImage: initialCoverImage[0] || null,
      uploadedImages: initialContentImages
    }
  })

  const handleCoverImageChange = (images: UploadedImage[]) => {
    form.setValue('uploadedCoverImage', images[0] || null, {
      shouldValidate: true
    })
  }
  const handleContentImagesChange = (images: UploadedImage[]) => {
    form.setValue('uploadedImages', images, { shouldValidate: true })
  }

  const onSubmit = async (data: ArticleFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      let result
      if (isEditMode && initialData) {
        result = await updateArticle(initialData.id, data)
      } else {
        result = await createArticle(data)
      }

      if (result.success) {
        onSuccess?.()
        router.refresh()
      } else {
        if (typeof result.error === 'string') setError(result.error)
        else setError('Erreur de validation. Vérifiez les champs.')
        console.error('Submit Error Object:', result.error)
      }
    } catch (err) {
      console.error('Submit Exception:', err)
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Titre*</FormLabel>{' '}
                <FormControl>
                  <Input placeholder="Titre de l article..." {...field} />
                </FormControl>{' '}
                <FormMessage />{' '}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Auteur</FormLabel>{' '}
                <FormControl>
                  <Input
                    placeholder="Nom de l auteur (optionnel)"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>{' '}
                <FormMessage />{' '}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu*</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              {' '}
              <FormLabel>Extrait (Optionnel)</FormLabel>{' '}
              <FormControl>
                <Textarea
                  placeholder="Court résumé..."
                  className="min-h-[80px]"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>{' '}
              <FormDescription>Affiché dans les listes.</FormDescription>{' '}
              <FormMessage />{' '}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Catégorie*</FormLabel>{' '}
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  {' '}
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir catégorie..." />
                    </SelectTrigger>
                  </FormControl>{' '}
                  <SelectContent>
                    {' '}
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}{' '}
                  </SelectContent>{' '}
                </Select>{' '}
                <FormMessage />{' '}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optionnel)</FormLabel>
                <FormControl>
                  <MultiSelectTags
                    availableTags={availableTags}
                    selectedTagIds={field.value || []}
                    onChange={field.onChange}
                    disabled={isLoading}
                    maxSelection={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Statut*</FormLabel>{' '}
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {' '}
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir statut..." />
                    </SelectTrigger>
                  </FormControl>{' '}
                  <SelectContent>
                    {' '}
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}{' '}
                  </SelectContent>{' '}
                </Select>{' '}
                <FormMessage />{' '}
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="uploadedCoverImage"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Image Couverture</FormLabel>{' '}
                <FormControl>
                  <ImageDndUpload
                    images={field.value ? [field.value] : []}
                    onImagesChange={handleCoverImageChange}
                    maxFiles={1}
                    disabled={isLoading}
                    className="mt-2"
                  />
                </FormControl>
                <FormMessage />{' '}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uploadedImages"
            render={({ field }) => (
              <FormItem>
                {' '}
                <FormLabel>Images Additionnelles</FormLabel>{' '}
                <FormControl>
                  <ImageDndUpload
                    images={field.value || []}
                    onImagesChange={handleContentImagesChange}
                    maxFiles={5}
                    disabled={isLoading}
                    className="mt-2"
                  />
                </FormControl>
                <FormMessage />{' '}
              </FormItem>
            )}
          />
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            disabled={isLoading}
          >
            {' '}
            Annuler{' '}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {' '}
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}{' '}
            {isEditMode ? 'Mettre à jour' : 'Créer'}{' '}
          </Button>
        </div>
      </form>
    </Form>
  )
}
