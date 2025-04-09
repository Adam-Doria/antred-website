'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger // Importé mais utilisé avec asChild
} from '@/components/ui/dialog'
import { ArticleForm } from './ArticleForm'
import { ArticleRO, CategoryRO, TagRO } from '../types/articles.type'
import { Skeleton } from '@/components/ui/skeleton'
import { getArticleById } from '../actions/queries/getArticleById'
import { getAllCategories } from '../actions/queries/getCategories'
import { getAllTags } from '../actions/queries/getTags'

interface EditArticleDialogProps {
  articleId: string
  trigger: React.ReactNode // Le composant déclencheur (ex: DropdownMenuItem)
}

export function EditArticleDialog({
  articleId,
  trigger
}: EditArticleDialogProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [articleData, setArticleData] = useState<ArticleRO | null>(null)
  const [categories, setCategories] = useState<CategoryRO[]>([])
  const [tags, setTags] = useState<TagRO[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !articleData && !isLoadingData && !error) {
      loadInitialData()
    }
    if (!open) {
      setArticleData(null)
      setError(null)
    }
  }

  const loadInitialData = async () => {
    setIsLoadingData(true)
    setError(null)
    try {
      const [articleResult, categoriesResult, tagsResult] = await Promise.all([
        getArticleById(articleId),
        getAllCategories(),
        getAllTags()
      ])

      if (!articleResult) {
        throw new Error('Article non trouvé.')
      }
      setArticleData(articleResult)
      setCategories(categoriesResult)
      setTags(tagsResult)
    } catch (err) {
      console.error('Error loading data for editing article:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Impossible de charger les données.'
      )
      // Ne pas fermer la modale automatiquement, laisser l'utilisateur voir l'erreur
      // setIsOpen(false);
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Modifier l&apos;article
            {isLoadingData ? '' : `: ${articleData?.title ?? '...'}`}
          </DialogTitle>
        </DialogHeader>
        {isLoadingData ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-destructive">
            <p>Erreur lors du chargement:</p>
            <p>{error}</p>
          </div>
        ) : articleData ? (
          <ArticleForm
            initialData={articleData}
            availableCategories={categories}
            availableTags={tags}
            onSuccess={handleSuccess}
          />
        ) : (
          <div className="flex justify-center items-center h-40"></div>
        )}
      </DialogContent>
    </Dialog>
  )
}
