// src/features/articles/components/MultiSelectTags.tsx
'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TagRO } from '../types/articles.type'

interface MultiSelectTagsProps {
  availableTags: TagRO[] // Tous les tags possibles
  selectedTagIds: string[] // IDs des tags actuellement sélectionnés
  onChange: (selectedIds: string[]) => void // Callback pour mettre à jour le formulaire parent
  placeholder?: string
  disabled?: boolean
  maxSelection?: number
}

export function MultiSelectTags({
  availableTags,
  selectedTagIds = [],
  onChange,
  placeholder = 'Sélectionner des tags...',
  disabled = false,
  maxSelection
}: MultiSelectTagsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [openPopover, setOpenPopover] = useState(false)
  const [inputValue, setInputValue] = useState('') // Pour la recherche dans le CommandInput

  // Obtenir les objets Tag complets pour les IDs sélectionnés
  const selectedTags = React.useMemo(() => {
    return availableTags.filter((tag) => selectedTagIds.includes(tag.id))
  }, [availableTags, selectedTagIds])

  // Fonction pour ajouter/retirer un tag
  const handleTagToggle = useCallback(
    (tagId: string) => {
      let newSelectedIds: string[]
      if (selectedTagIds.includes(tagId)) {
        // Retirer le tag
        newSelectedIds = selectedTagIds.filter((id) => id !== tagId)
      } else {
        // Ajouter le tag (si la limite n'est pas atteinte)
        if (maxSelection && selectedTagIds.length >= maxSelection) {
          return // Ne rien faire si max atteint
        }
        newSelectedIds = [...selectedTagIds, tagId]
      }
      onChange(newSelectedIds)
    },
    [selectedTagIds, onChange, maxSelection]
  )

  // Fermer le popover si on clique à l'extérieur
  // (Simple exemple, pourrait être amélioré avec une lib comme react-popper)
  /*
    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        // Logique pour détecter clic extérieur
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [openPopover]);
    */

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openPopover}
          className={cn(
            'w-full justify-between h-auto min-h-10', // Ajuster hauteur auto
            selectedTags.length > 0 ? 'h-auto' : 'h-10'
          )}
          onClick={() => setOpenPopover(!openPopover)}
          disabled={disabled}
        >
          {/* Afficher les badges des tags sélectionnés ou le placeholder */}
          {selectedTags.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{ borderColor: tag.color, color: tag.color }}
                  className="px-2 py-0.5"
                >
                  {tag.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTagToggle(tag.id)
                    }}
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {' '}
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />{' '}
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {/* Icône Chevron ? (Optionnel) */}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            ref={inputRef}
            placeholder="Rechercher un tag..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault()
            }}
          />
          <CommandList>
            <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
            <CommandGroup>
              {availableTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id)
                // Filtrer basé sur inputValue (simple recherche sur le nom)
                const matchesSearch = tag.name
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())

                if (!matchesSearch) return null // Ne pas afficher si ne correspond pas à la recherche

                return (
                  <CommandItem
                    key={tag.id}
                    value={tag.name} // Utiliser le nom pour la recherche/filtrage Command
                    onSelect={() => {
                      handleTagToggle(tag.id)
                      // Optionnel: garder le popover ouvert après sélection
                      setOpenPopover(true) // Ou false pour fermer après sélection
                    }}
                    disabled={
                      disabled ||
                      (!isSelected &&
                        !!maxSelection &&
                        selectedTagIds.length >= maxSelection)
                    }
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {/* Pastille couleur */}
                      <div
                        className="h-3 w-3 rounded-full border flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#cccccc' }}
                      />
                      <span>{tag.name}</span>
                    </div>

                    {/* Indicateur de sélection */}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
