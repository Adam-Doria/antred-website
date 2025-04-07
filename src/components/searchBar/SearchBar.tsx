'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  className?: string
  inputClassName?: string
  debounceMs?: number
  autoFocus?: boolean
}

export function SearchBar({
  initialQuery = '',
  placeholder = 'Rechercher...',
  className,
  inputClassName,
  debounceMs = 300,
  autoFocus = false
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialQuery)
  const debouncedValue = useDebounce(inputValue, debounceMs)
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (debouncedValue) {
      params.set('q', debouncedValue)
    } else {
      params.delete('q')
    }

    params.set('page', '1')

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl)
  }, [debouncedValue, router])

  const handleClear = () => {
    setInputValue('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn('pl-8', inputClassName)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-2 h-5 w-5 rounded-full text-muted-foreground hover:bg-muted flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  )
}
