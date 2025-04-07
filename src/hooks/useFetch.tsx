'use client'

import { useState, useEffect } from 'react'

// Types pour l'état de la requête
interface FetchState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseFetchOptions<T> {
  fetcher: () => Promise<T>
  initialData?: T | null
  autoFetch?: boolean
  /* eslint-disable @typescript-eslint/no-explicit-any */
  dependencies?: any[]
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useFetch<T>({
  fetcher,
  initialData = null,
  autoFetch = true,
  dependencies = [],
  onSuccess,
  onError
}: UseFetchOptions<T>) {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    loading: !!autoFetch,
    error: null
  })

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await fetcher()
      setState({ data, loading: false, error: null })

      if (onSuccess) {
        onSuccess(data)
      }

      return data
    } catch (error) {
      const errorObj =
        error instanceof Error ? error : new Error('Une erreur est survenue')

      setState((prev) => ({ ...prev, loading: false, error: errorObj }))

      if (onError) {
        onError(errorObj)
      }

      return null
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, dependencies)

  return {
    ...state,
    fetchData,

    reset: () => setState({ data: initialData, loading: false, error: null })
  }
}
