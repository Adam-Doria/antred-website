'use client'
import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  Updater
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  ImageOff
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/pagination/Pagination'
import { IPagination } from '@/lib/paginatedQuery'
import { useRouter } from 'next/navigation'
import { ArticleRO, TagRO, ArticleStatus } from '../types/articles.type'
import { deleteArticle } from '../actions/mutations/deleteArticle'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { EditArticleDialog } from './EditArticleDialog'
import Image from 'next/image' // Importer le composant Image

const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Date invalide'
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  } catch (e) {
    return 'Date invalide'
  }
}

interface DeleteArticleAlertProps {
  articleId: string
  articleTitle: string
  onSuccess?: () => void
}
function DeleteArticleAlert({
  articleId,
  articleTitle,
  onSuccess
}: DeleteArticleAlertProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleDelete = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await deleteArticle(articleId)
      if (result.success) {
        setIsOpen(false)
        onSuccess?.()
        router.refresh()
      } else {
        setError(result.error || 'Échec suppression.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur.')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(e) => {
            e.preventDefault()
            setIsOpen(true)
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {' '}
        <AlertDialogHeader>
          {' '}
          <AlertDialogTitle>Confirmer</AlertDialogTitle>{' '}
          <AlertDialogDescription>
            Supprimer {articleTitle} ?
          </AlertDialogDescription>{' '}
          {error && (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          )}{' '}
        </AlertDialogHeader>{' '}
        <AlertDialogFooter>
          {' '}
          <AlertDialogCancel disabled={isLoading}>
            Annuler
          </AlertDialogCancel>{' '}
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </AlertDialogAction>{' '}
        </AlertDialogFooter>{' '}
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface ArticlesTableProps {
  data: ArticleRO[]
  pagination: IPagination
  basePath: string
  searchQuery?: string
  statusFilter?: ArticleStatus
}

export function ArticlesTable({
  data,
  pagination,
  basePath
}: ArticlesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const updateQueryParams = (params: URLSearchParams) => {
    router.push(`${basePath}?${params.toString()}`, { scroll: false })
  }
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', page.toString())
    params.set('limit', pagination.limit.toString())
    /* conserver filtres */ updateQueryParams(params)
  }
  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', '1')
    params.set('limit', size.toString())
    /* conserver filtres */ updateQueryParams(params)
  }
  const handleSortChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater
    setSorting(newSorting)
    const params = new URLSearchParams(window.location.search)
    if (newSorting.length > 0) {
      params.set(
        'sort',
        `${newSorting[0].id}:${newSorting[0].desc ? 'desc' : 'asc'}`
      )
    } else {
      params.delete('sort')
    }
    params.set('page', '1')
    updateQueryParams(params)
  }

  const columns: ColumnDef<ArticleRO>[] = [
    {
      // --- Nouvelle Colonne Image ---
      id: 'coverImage',
      header: '', // Pas de titre
      cell: ({ row }) => {
        const imageUrl = row.original.coverImageUrl
        return (
          <div className="w-16 h-10 relative rounded overflow-hidden border bg-muted flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Couverture ${row.original.title}`}
                fill
                sizes="64px" // Taille de la miniature
                className="object-cover"
              />
            ) : (
              <ImageOff className="h-5 w-5 text-muted-foreground" /> // Icône placeholder
            )}
          </div>
        )
      },
      enableSorting: false,
      size: 80 // Taille fixe pour la colonne
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {' '}
          Titre <ArrowUpDown className="ml-2 h-4 w-4" />{' '}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('title')}</div>
      )
    },
    {
      // --- Nouvelle Colonne Auteur ---
      accessorKey: 'authorName',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {' '}
          Auteur <ArrowUpDown className="ml-2 h-4 w-4" />{' '}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue('authorName') || '-'}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {' '}
          Statut <ArrowUpDown className="ml-2 h-4 w-4" />{' '}
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as ArticleStatus
        let variant: 'default' | 'secondary' | 'outline' = 'secondary'
        if (status === 'published') variant = 'default'
        if (status === 'archived') variant = 'outline'
        const statusText =
          status === 'draft'
            ? 'Brouillon'
            : status === 'published'
              ? 'Publié'
              : 'Archivé'
        return (
          <Badge variant={variant} className="capitalize">
            {statusText}
          </Badge>
        )
      }
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => {
        const tags = row.original.tags || []
        if (tags.length === 0)
          return <span className="text-xs text-muted-foreground">-</span>
        return (
          <div className="flex flex-wrap gap-1 max-w-[150px]">
            {tags.map((tag: TagRO) => (
              <Badge
                key={tag.id}
                variant="outline"
                style={{ borderColor: tag.color, color: tag.color }}
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )
      },
      enableSorting: false
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {' '}
          MàJ <ArrowUpDown className="ml-2 h-4 w-4" />{' '}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xs">{formatDate(row.getValue('updatedAt'))}</span>
      ) // Taille texte réduite
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const article = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditArticleDialog
                articleId={article.id}
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {' '}
                    <Edit className="mr-2 h-4 w-4" /> Modifier{' '}
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <DeleteArticleAlert
                articleId={article.id}
                articleTitle={article.title}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: handleSortChange,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150
                          ? `${header.getSize()}px`
                          : undefined
                    }}
                  >
                    {' '}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}{' '}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Aucun article trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
