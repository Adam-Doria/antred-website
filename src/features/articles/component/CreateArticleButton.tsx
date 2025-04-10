'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ArticleForm } from './ArticleForm'
import { CategoryRO, TagRO } from '../types/articles.type'

interface CreateArticleButtonProps {
  categoryId: string
  categoryName: string
  availableCategories: CategoryRO[]
  availableTags: TagRO[]
}

export function CreateArticleButton({
  categoryId,
  categoryName,
  availableCategories,
  availableTags
}: CreateArticleButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un article ({categoryName})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouvel article dans {categoryName}</DialogTitle>
        </DialogHeader>
        <ArticleForm
          initialCategoryId={categoryId}
          availableCategories={availableCategories}
          availableTags={availableTags}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
