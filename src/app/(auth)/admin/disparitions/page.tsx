import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SearchBar } from '@/components/searchBar/SearchBar'
import { MissingPersonsTableClient } from '@/features/missingPersons/components/MissingPersonsTable'
import { getMissingPerson } from '@/features/missingPersons/actions'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Page serveur avec recherche basée sur les paramètres d'URL
export default async function MissingPersonsPage({
  searchParams
}: {
  searchParams: { q?: string; page?: string; limit?: string }
}) {
  // Récupérer les paramètres de recherche depuis l'URL
  const searchQuery = searchParams.q || ''
  const page = parseInt(searchParams.page || '1', 10)
  const limit = parseInt(searchParams.limit || '10', 10)

  // Récupérer les données directement depuis le serveur
  const { data: missingPersons, pagination } = await getMissingPerson({
    page,
    limit,
    search: searchQuery
  })

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-2xl font-bold">Gestion des personnes disparues</h1>
        <p className="text-muted-foreground">
          Gérez ici les fiches des personnes disparues.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          initialQuery={searchQuery}
          placeholder="Rechercher une personne..."
          className="w-full max-w-md"
        />

        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une personne disparue
        </Button>
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
