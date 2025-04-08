import { SearchBar } from '@/components/searchBar/SearchBar'
import { MissingPersonsTableClient } from '@/features/missingPersons/components/MissingPersonsTable'
import { getMissingPerson } from '@/features/missingPersons/actions'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateMissingPersonButton } from '@/features/missingPersons/components/CreateMissingPersonButton'

export const dynamic = 'force-dynamic'

type SearchParamsProps = Promise<{
  q?: string
  page?: string
  limit?: string
}>

export default async function MissingPersonsPage({
  searchParams: searchParamsPromise
}: {
  searchParams: SearchParamsProps
}) {
  const searchParams = await searchParamsPromise
  const searchQuery = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)
  const limit = parseInt(searchParams.limit || '10', 10)

  const { data: missingPersons, pagination } = await getMissingPerson({
    page,
    limit,
    search: searchQuery
  })

  return (
    <div className="space-y-6 p-2 w-full">
      <div>
        <h1 className="text-2xl font-bold">Gestion des personnes disparues</h1>
        <p className="text-secondaryForeground">
          Gérez ici les fiches des personnes disparues.
        </p>
      </div>

      <div className="flex items-center justify-between p-2">
        <SearchBar
          initialQuery={searchQuery}
          placeholder="Rechercher une personne..."
          className="w-full max-w-md"
        />

        <CreateMissingPersonButton />
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        }
      >
        <MissingPersonsTableClient
          data={missingPersons}
          pagination={{
            currentPage: page,
            pageSize: limit,
            totalPages: pagination.totalPages,
            totalItems: pagination.total
          }}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  )
}
