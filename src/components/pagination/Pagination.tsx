import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  className?: string
  showPageSizeSelector?: boolean
  showSummary?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className,
  showPageSizeSelector = true,
  showSummary = true
}: PaginationProps) {
  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      {showSummary && (
        <div className="text-sm text-secondary-foreground">
          Affichage de {Math.min((currentPage - 1) * pageSize + 1, totalItems)}{' '}
          à {Math.min(currentPage * pageSize, totalItems)} sur {totalItems} dans
          la base{' '}
        </div>
      )}

      <div className="flex items-center space-x-2 ml-auto">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            title="Première page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-sm mx-2">
            Page {currentPage} sur {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Dernière page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        {showPageSizeSelector && (
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-[115px]">
              <SelectValue placeholder="Afficher par" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} par page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  )
}
