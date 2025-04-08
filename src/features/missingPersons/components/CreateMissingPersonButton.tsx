'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { MissingPersonForm } from './MissingPersonForm'

export function CreateMissingPersonButton() {
  // État pour contrôler l'ouverture/fermeture de la modale
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Ajouter une personne disparue
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle personne disparue</DialogTitle>
          </DialogHeader>
          <MissingPersonForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
