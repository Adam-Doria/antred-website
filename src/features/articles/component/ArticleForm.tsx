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
import { MultiSelectTags } from './MultiSelectTag'
import { createArticle } from '../actions/mutations/createArticle'
import { updateArticle } from '../actions/mutations/updateArticle'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
  availableTags,
  onSuccess
}: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditMode = !!initialData
  const router = useRouter()

  const initialCoverImage = initialData?.coverImageUrl
    ? [{ url: initialData.coverImageUrl, isNew: false }]
    : []
  // --- CORRECTION: Lire les images du carrousel depuis content.images ---
  const initialCarouselImages: UploadedImage[] =
    initialData?.content?.images?.map((url) => ({ url, isNew: false })) || []
  const initialContent = initialData?.content || {}

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: {
        introduction: initialContent.introduction || '', // Utiliser '' au lieu de '<p></p>'
        part1: initialContent.part1 || '',
        quote: initialContent.quote || '',
        part2: initialContent.part2 || '',
        images: [], // Ce champ reste vide, géré par uploadedCarouselImages
        part3: initialContent.part3 || '',
        // Initialiser l'uploader avec les images existantes
        uploadedCarouselImages: initialCarouselImages
      },
      excerpt: initialData?.excerpt || '',
      categoryId:
        !isEditMode && initialCategoryId
          ? initialCategoryId
          : initialData?.categoryId || null,
      tagIds: initialData?.tags?.map((tag) => tag.id) || [],
      authorName: initialData?.authorName || '',
      status: initialData?.status || 'draft',
      uploadedCoverImage: initialCoverImage[0] || null
    }
  })

  const handleCoverImageChange = (images: UploadedImage[]) => {
    form.setValue('uploadedCoverImage', images[0] || null, {
      shouldValidate: true
    })
  }
  const handleCarouselImagesChange = (images: UploadedImage[]) => {
    // --- CORRECTION: Utiliser le bon nom de champ ---
    form.setValue('content.uploadedCarouselImages', images, {
      shouldValidate: true
    })
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
        else if (result.error && typeof result.error === 'object') {
          const firstKey = Object.keys(result.error)[0]
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const messages = (result.error as any)[firstKey]
          const msg = Array.isArray(messages)
            ? messages[0]
            : 'Erreur validation'
          setError(msg || 'Erreur de validation.')
        } else {
          setError('Erreur inconnue.')
        }
        console.error('Submit Error Object:', result.error)
      }
    } catch (err) {
      console.error('Submit Exception:', err)
      setError(err instanceof Error ? err.message : 'Erreur.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Form {...form}>
        <form
          id={`article-form-${initialData?.id || 'new'}`}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre*</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auteur</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Optionnel)"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content.introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Introduction</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value ?? ''}
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
            name="content.part1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partie 1*</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value ?? ''}
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
            name="content.quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Citation..."
                    {...field}
                    value={field.value ?? ''}
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content.part2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partie 2</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value ?? ''}
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
            name="content.part3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partie 3</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value ?? ''}
                    onChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie*</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* --- Tags (sans FormControl) --- */}
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <MultiSelectTags
                    availableTags={availableTags}
                    selectedTagIds={field.value || []}
                    onChange={field.onChange}
                    disabled={isLoading}
                    className="mt-2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut*</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir..." />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="uploadedCoverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Couverture</FormLabel>
                  <FormControl>
                    <ImageDndUpload
                      images={field.value ? [field.value] : []}
                      onImagesChange={handleCoverImageChange}
                      maxFiles={1}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content.uploadedCarouselImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images Carrousel</FormLabel>
                  <FormControl>
                    <ImageDndUpload
                      images={field.value || []}
                      onImagesChange={handleCarouselImagesChange}
                      maxFiles={10}
                      disabled={isLoading}
                      className="mt-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Extrait */}
          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Extrait</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Court résumé..."
                    className="min-h-[80px]"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormDescription>Pour SEO et aperçus.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Erreur Générale et Boutons */}
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
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    </DndProvider>
  )
}
