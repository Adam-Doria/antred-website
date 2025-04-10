/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, X, Palette, Edit, Check, Undo2, Loader2 } from 'lucide-react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'

import {
  categorySchema,
  tagSchema,
  CategoryFormValues,
  TagFormValues
} from '../schema/articles.schema'

import { createCategory } from '../actions/mutations/createCategory'
import { updateCategory } from '../actions/mutations/updateCategory'
import { deleteCategory } from '../actions/mutations/deleteCategory'
import { createTag } from '../actions/mutations/createTag'
import { updateTag } from '../actions/mutations/updateTag'
import { deleteTag } from '../actions/mutations/deleteTag'
import { CategoryRO, TagRO } from '../types/articles.type'

type CategoryFormData = {
  name: string
  description?: string | null
}

type TagFormData = {
  name: string
  color?: string | null
}

type FormValues = CategoryFormData | TagFormData

type ActionError =
  | string
  | null
  | undefined
  | z.inferFlattenedErrors<z.ZodType<any, any, any>>['fieldErrors']

interface EditingState {
  id: string
  initialData: FormValues
}

interface SettingsListEditorProps {
  items: (CategoryRO | TagRO)[]
  entityType: 'category' | 'tag'
  canManage: boolean
}

export function SettingsListEditor({
  items,
  entityType,
  canManage
}: SettingsListEditorProps) {
  const router = useRouter()
  const [currentItems, setCurrentItems] =
    useState<(CategoryRO | TagRO)[]>(items)
  const [editingItem, setEditingItem] = useState<EditingState | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [actionError, setActionError] = useState<ActionError>(null)

  useEffect(() => {
    setCurrentItems(items)
  }, [items])

  const isCategory = entityType === 'category'
  const schema = useMemo(
    () => (isCategory ? categorySchema : tagSchema),
    [isCategory]
  )
  const entityName = isCategory ? 'Catégorie' : 'Tag'
  const showColorField = !isCategory

  const defaultFormValues = useMemo(() => {
    if (isCategory) {
      return {
        name: '',
        description: ''
      } as CategoryFormData
    } else {
      return {
        name: '',
        color: '#cccccc'
      } as TagFormData
    }
  }, [isCategory])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema as z.ZodType<any, any, any>),
    defaultValues: defaultFormValues
  })

  useEffect(() => {
    if (!editingItem) {
      form.reset(defaultFormValues)
    }
  }, [defaultFormValues, editingItem, form])

  const startEditing = (item: CategoryRO | TagRO) => {
    setActionError(null)

    let itemData: FormValues

    if (isCategory) {
      const categoryItem = item as CategoryRO
      itemData = {
        name: categoryItem.name,
        description: categoryItem.description ?? undefined
      } as CategoryFormData
    } else {
      const tagItem = item as TagRO
      itemData = {
        name: tagItem.name,
        color: tagItem.color ?? '#cccccc'
      } as TagFormData
    }

    setEditingItem({ id: item.id, initialData: itemData })
    form.reset(itemData)
  }

  const cancelEditing = () => {
    setEditingItem(null)
    setActionError(null)
    form.reset(defaultFormValues)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true)
    setActionError(null)
    let result: { success: boolean; error?: ActionError }

    try {
      if (editingItem) {
        if (isCategory) {
          const relevantData: CategoryFormValues = {
            name: data.name,
            description:
              isCategory && 'description' in data ? data.description : undefined
          }
          result = await updateCategory(editingItem.id, relevantData)
        } else {
          const relevantData: TagFormValues = {
            name: data.name,
            color:
              !isCategory && 'color' in data
                ? (data.color ?? '#cccccc')
                : '#cccccc'
          }
          result = await updateTag(editingItem.id, relevantData)
        }
      } else {
        if (isCategory) {
          const relevantData: CategoryFormValues = {
            name: data.name,
            description:
              isCategory && 'description' in data ? data.description : undefined
          }
          result = await createCategory(relevantData)
        } else {
          const relevantData: TagFormValues = {
            name: data.name,
            color:
              !isCategory && 'color' in data
                ? (data.color ?? '#cccccc')
                : '#cccccc'
          }
          result = await createTag(relevantData)
        }
      }

      if (result.success) {
        form.reset(defaultFormValues)
        setEditingItem(null)
        router.refresh()
      } else {
        setActionError(result.error ?? `Erreur ${entityName}.`)
        if (typeof result.error === 'object')
          console.error('Validation Error:', result.error)
      }
    } catch (err) {
      console.error(`${entityName} action error:`, err)
      setActionError(
        err instanceof Error ? err.message : `Erreur ${entityName}.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    setActionError(null)
    let result: { success: boolean; error?: string }

    try {
      if (isCategory) {
        result = await deleteCategory(id)
      } else {
        result = await deleteTag(id)
      }

      if (result.success) {
        if (editingItem?.id === id) {
          cancelEditing()
        }
        router.refresh()
      } else {
        setActionError(result.error ?? `Erreur suppression ${entityName}.`)
      }
    } catch (err) {
      console.error(`Delete ${entityName} error:`, err)
      setActionError(
        err instanceof Error ? err.message : `Erreur suppression ${entityName}.`
      )
    } finally {
      setIsLoading(false)
    }
  }

  const renderColorField = () => {
    if (!showColorField) return null

    return (
      <Controller
        name="color"
        control={form.control}
        render={({ field }) => (
          <div className="relative h-10 w-10 flex-shrink-0">
            <label
              htmlFor={`${entityName}-color-picker`}
              className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-md border bg-background hover:bg-muted"
              style={{ backgroundColor: field.value ?? '#cccccc' }}
            >
              <Palette className="h-4 w-4 text-white mix-blend-difference" />
            </label>
            <Input
              id={`${entityName}-color-picker`}
              type="color"
              {...field}
              value={field.value ?? '#cccccc'}
              disabled={isLoading || !canManage}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        )}
      />
    )
  }

  const renderDescriptionField = () => {
    if (!isCategory) return null

    return (
      <Controller
        name="description"
        control={form.control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Description (optionnel)"
            disabled={isLoading}
            className="mt-2"
            value={field.value || ''}
          />
        )}
      />
    )
  }

  // Fonction d'aide pour accéder de manière sécurisée aux erreurs du formulaire
  const getFieldError = (fieldName: string) => {
    return form.formState.errors[
      fieldName as keyof typeof form.formState.errors
    ]?.message as string | undefined
  }

  return (
    <div
      className={`space-y-4 ${!canManage ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <h3 className="text-lg font-semibold">{entityName}s</h3>
      {!canManage && (
        <p className="text-sm text-secondary-foreground">
          Permissions insuffisantes.
        </p>
      )}

      <div className="space-y-2">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-center justify-between p-2 border rounded-md bg-secondary/30 min-h-[48px]',
              editingItem?.id === item.id && 'ring-2 ring-primary ring-offset-1'
            )}
          >
            <div className="flex items-center space-x-2 overflow-hidden mr-1">
              {showColorField && 'color' in item && (
                <div
                  className="h-4 w-4 rounded-full border flex-shrink-0"
                  style={{
                    backgroundColor: item.color || '#cccccc'
                  }}
                />
              )}
              <span className="truncate">{item.name}</span>
              {isCategory && 'description' in item && item.description && (
                <span className="text-xs text-secondary-foreground truncate">
                  ({item.description})
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-secondary-foreground hover:text-primary"
                onClick={() => startEditing(item)}
                disabled={
                  isLoading || !canManage || editingItem?.id === item.id
                }
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-secondary-foreground hover:text-destructive"
                    disabled={isLoading || !canManage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmer</AlertDialogTitle>
                    <AlertDialogDescription>
                      Supprimer {item.name} ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(item.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
        {currentItems.length === 0 && canManage && (
          <p className="text-sm text-secondary-foreground">
            Aucun {entityName.toLowerCase()} défini.
          </p>
        )}
      </div>

      {canManage && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 pt-2"
        >
          <div className="flex items-start space-x-2">
            <div className="flex-grow">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={
                      editingItem
                        ? `Modifier "${editingItem?.initialData?.name}"`
                        : `Nouveau ${entityName.toLowerCase()}...`
                    }
                    disabled={isLoading}
                  />
                )}
              />
              {getFieldError('name') && (
                <p className="text-xs text-destructive mt-1">
                  {getFieldError('name')}
                </p>
              )}
            </div>
            {renderColorField()}
            <Button type="submit" disabled={isLoading} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingItem ? (
                <Check className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
            {editingItem && (
              <Button
                type="button"
                variant="ghost"
                disabled={isLoading}
                size="icon"
                onClick={cancelEditing}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {renderDescriptionField()}

          {/* Affichage des erreurs pour les autres champs avec accès sécurisé */}
          {showColorField && getFieldError('color') && (
            <p className="text-xs text-destructive mt-1">
              {getFieldError('color')}
            </p>
          )}

          {isCategory && getFieldError('description') && (
            <p className="text-xs text-destructive mt-1">
              {getFieldError('description')}
            </p>
          )}
        </form>
      )}

      {actionError && typeof actionError === 'string' && (
        <p className="text-sm font-medium text-destructive mt-1">
          {actionError}
        </p>
      )}
      {actionError && typeof actionError !== 'string' && (
        <p className="text-sm font-medium text-destructive mt-1">
          Erreur de validation. Vérifiez les champs.
        </p>
      )}
    </div>
  )
}
