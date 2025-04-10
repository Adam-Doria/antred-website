'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ArticleStatus } from '../types/articles.type'

interface ArticleStatusFilterProps {
  currentStatus?: ArticleStatus
  basePath: string
}

const statusOptions: { value: ArticleStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
  { value: 'archived', label: 'Archivé' }
]

export function ArticleStatusFilter({
  currentStatus
}: ArticleStatusFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleStatusChange = (newStatus: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (newStatus === 'all') {
      current.delete('status')
    } else {
      current.set('status', newStatus)
    }
    current.set('page', '1')
    const search = current.toString()
    const query = search ? `?${search}` : ''

    router.push(`${pathname}${query}`)
  }

  return (
    <Select value={currentStatus || 'all'} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par statut..." />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
