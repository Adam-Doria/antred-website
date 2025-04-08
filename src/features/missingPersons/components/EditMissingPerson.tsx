'use client'

import { useState } from 'react'
import { MissingPersonRO } from '../types/missingPerson.type'
import { MissingPersonForm } from './MissingPersonForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Edit } from 'lucide-react'

interface EditMissingPersonProps {
  person: MissingPersonRO
  onSuccess?: () => void
}

export function EditMissingPerson({
  person,
  onSuccess
}: EditMissingPersonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
    onSuccess?.()
  }

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
      >
        <Edit className="mr-2 h-4 w-4" />
        Modifier
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[80vh] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Modifier les informations de {person.firstName} {person.lastName}
            </DialogTitle>
          </DialogHeader>
          <MissingPersonForm initialData={person} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
