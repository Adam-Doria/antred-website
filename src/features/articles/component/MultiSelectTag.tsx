'use client'

import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { X, Check, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TagRO } from '../types/articles.type'

interface MultiSelectTagsProps {
  availableTags: TagRO[]
  selectedTagIds: string[]
  onChange: (selectedIds: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  maxSelection?: number
  className?: string
  listHeight?: string
}

export function MultiSelectTags({
  availableTags,
  selectedTagIds = [],
  onChange,
  placeholder = 'Sélectionner des tags...',
  searchPlaceholder = 'Rechercher un tag...',
  disabled = false,
  maxSelection,
  className,
  listHeight = 'max-h-48'
}: MultiSelectTagsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsMap = useMemo(
    () => new Map(availableTags.map((tag) => [tag.id, tag])),
    [availableTags]
  )

  const selectedTags = useMemo(
    () =>
      selectedTagIds
        .map((id) => tagsMap.get(id))
        .filter((tag): tag is TagRO => !!tag),
    [selectedTagIds, tagsMap]
  )

  const filteredTags = useMemo(() => {
    return availableTags.filter((tag) =>
      tag.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [availableTags, searchValue])

  const removeTag = useCallback(
    (tagId: string, e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      onChange(selectedTagIds.filter((id) => id !== tagId))
    },
    [selectedTagIds, onChange]
  )

  const toggleTag = useCallback(
    (tagId: string) => {
      if (disabled) return

      const isSelected = selectedTagIds.includes(tagId)
      let newSelectedIds: string[]

      if (isSelected) {
        newSelectedIds = selectedTagIds.filter((id) => id !== tagId)
      } else {
        if (
          maxSelection !== undefined &&
          selectedTagIds.length >= maxSelection
        ) {
          console.warn('Limite de sélection atteinte') // Feedback optionnel
          return
        }
        newSelectedIds = [...selectedTagIds, tagId]
      }
      onChange(newSelectedIds)
    },
    [selectedTagIds, onChange, maxSelection, disabled]
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false)
      }
    }
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isExpanded])

  return (
    <div
      ref={containerRef}
      className={cn('relative border rounded-md', className)}
    >
      <button
        type="button"
        className={cn(
          'w-full flex flex-wrap gap-1 items-center p-2 min-h-[40px] text-left cursor-pointer',
          disabled
            ? 'bg-muted cursor-not-allowed opacity-50'
            : 'bg-background hover:bg-muted/50'
        )}
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-haspopup="listbox"
        aria-controls="tag-listbox"
      >
        <div className="flex-grow flex flex-wrap gap-1 items-center">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="px-2 py-0.5 text-xs font-medium rounded-sm whitespace-nowrap"
              >
                <span
                  className="w-2 h-2 rounded-full mr-1.5 inline-block flex-shrink-0 border"
                  style={{
                    backgroundColor: tag.color || '#cccccc',
                    borderColor: tag.color || 'hsl(var(--border))'
                  }}
                />
                {tag.name}
                <button
                  type="button"
                  aria-label={`Retirer ${tag.name}`}
                  className={cn(
                    'ml-1.5 ring-offset-background rounded-full outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 opacity-70 hover:opacity-100 transition-opacity',
                    disabled && 'hidden'
                  )}
                  onClick={(e) => removeTag(tag.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') removeTag(tag.id, e)
                  }}
                  disabled={disabled}
                  tabIndex={-1}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <div className="ml-2 flex-shrink-0">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t p-2">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8 h-9"
              disabled={disabled}
              aria-controls="tag-listbox"
            />
          </div>

          <ul
            id="tag-listbox"
            role="listbox"
            aria-multiselectable="true"
            className={cn('space-y-1 overflow-y-auto', listHeight)}
          >
            {filteredTags.length === 0 ? (
              <li className="py-2 px-1 text-sm text-center text-muted-foreground">
                {searchValue ? 'Aucun tag trouvé.' : 'Aucun tag disponible.'}
              </li>
            ) : (
              filteredTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id)

                const isDisabledItem =
                  disabled ||
                  (!isSelected &&
                    maxSelection !== undefined &&
                    selectedTagIds.length >= maxSelection)

                return (
                  <li
                    key={tag.id}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={isDisabledItem ? -1 : 0}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
                      isDisabledItem
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:bg-accent focus-visible:bg-accent focus-visible:ring-1 focus-visible:ring-ring'
                    )}
                    onClick={() => !isDisabledItem && toggleTag(tag.id)}
                    onKeyDown={(e) => {
                      if (
                        (e.key === 'Enter' || e.key === ' ') &&
                        !isDisabledItem
                      ) {
                        toggleTag(tag.id)
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 flex-grow truncate">
                      <span
                        className="h-3 w-3 rounded-full border inline-block flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#cccccc' }}
                        aria-hidden="true"
                      />
                      <span className="truncate">{tag.name}</span>
                    </div>

                    {isSelected && (
                      <Check
                        className="h-4 w-4 text-primary flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
