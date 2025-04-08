'use client'

import { useFetch } from '@/hooks/useFetch'
import { getMissingPerson } from '@/features/missingPersons/actions'
import { MissingPersonRO } from '@/features/missingPersons/types/missingPerson.type'
import { PaginationResult } from '@/lib/paginatedQuery'
import { useState } from 'react'

interface UseMissingPersonsParams {
  initialPage?: number
  initialPageSize?: number
  initialSearch?: string
  order?: 'asc' | 'desc'
}

export function useMissingPersons({
  initialPage = 1,
  initialPageSize = 10,
  initialSearch = '',
  order = 'desc'
}: UseMissingPersonsParams = {}) {
  // États internes pour la pagination et la recherche
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState(initialSearch)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Fonction de récupération de données qui sera passée au hook useFetch
  const fetcher = async () => {
    const result = await getMissingPerson({
      page,
      limit: pageSize,
      search,
      order
    })

    // Mettre à jour les informations de pagination
    setTotalPages(result.pagination.totalPages)
    setTotalItems(result.pagination.total)

    return result
  }

  // Utilisation du hook useFetch pour gérer les requêtes
  const { data, loading, error, fetchData } = useFetch<
    PaginationResult<MissingPersonRO>
  >({
    fetcher,
    dependencies: [page, pageSize, search, order],
    initialData: {
      data: [],
      pagination: {
        total: 0,
        page: initialPage,
        limit: initialPageSize,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false
      }
    }
  })

  // Méthodes pour manipuler les paramètres de recherche et pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1) // Réinitialiser à la première page lors du changement de taille
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setPage(1) // Réinitialiser à la première page lors de la recherche
  }

  // Exposer les données et les méthodes
  return {
    // États
    missingPersons: data?.data || [],
    loading,
    error,
    pagination: {
      currentPage: page,
      pageSize,
      totalPages,
      totalItems,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages
    },
    search,

    // Méthodes
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,

    // Méthode pour recharger les données manuellement
    refresh: fetchData
  }
}
