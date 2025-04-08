'use client'

import { useState } from 'react'
import { deleteMissingPerson } from '../actions/mutations/deleteMissingPerson'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Trash2 } from 'lucide-react'

interface DeleteMissingPersonProps {
  id: string
  personName: string
  onSuccess?: () => void
}

export function DeleteMissingPerson({
  id,
  personName,
  onSuccess
}: DeleteMissingPersonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fonction pour gérer la suppression
  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteMissingPerson(id)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        onSelect={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Supprimer
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous sûr de vouloir supprimer?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement la fiche de{' '}
              <strong>{personName}</strong>.<br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
