'use client'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel
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
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/pagination/Pagination'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MissingPersonRO } from '@/features/missingPersons/types/missingPerson.type'
import { EditMissingPerson } from './EditMissingPerson'
import { DeleteMissingPerson } from './DeleteMissingPerson'

// Formatage de date pour l'affichage
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

interface MissingPersonsTableClientProps {
  data: MissingPersonRO[]
  pagination: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
  searchQuery: string
}

export function MissingPersonsTableClient({
  data,
  pagination,
  searchQuery
}: MissingPersonsTableClientProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const router = useRouter()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('limit', pagination.pageSize.toString())
    if (searchQuery) params.set('q', searchQuery)
    router.push(`/admin/disparitions?${params.toString()}`)
  }

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('limit', size.toString())
    if (searchQuery) params.set('q', searchQuery)
    router.push(`/admin/disparitions?${params.toString()}`)
  }

  const columns: ColumnDef<MissingPersonRO>[] = [
    {
      accessorKey: 'lastName',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('lastName')}</div>
      )
    },
    {
      accessorKey: 'firstName',
      header: 'Prénom',
      cell: ({ row }) => <div>{row.getValue('firstName')}</div>
    },
    {
      accessorKey: 'disappearanceDate',
      header: 'Date de disparition',
      cell: ({ row }) => formatDate(row.getValue('disappearanceDate'))
    },
    {
      accessorKey: 'country',
      header: 'Pays',
      cell: ({ row }) => <div>{row.getValue('country') || 'Non spécifié'}</div>
    },
    {
      accessorKey: 'updatedAt',
      header: 'Dernière mise à jour',
      cell: ({ row }) => formatDate(row.getValue('updatedAt'))
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const person = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menu d&#39;actions</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditMissingPerson person={person} />
              <DeleteMissingPerson
                id={person.id}
                personName={`${person.firstName} ${person.lastName}`}
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
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
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
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
