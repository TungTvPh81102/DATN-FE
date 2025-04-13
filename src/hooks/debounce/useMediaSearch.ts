import { IMediaQueryParams } from '@/types/Common'
import { useEffect, useState } from 'react'
import { useMedia } from '@/hooks/instructor/lesson/useLesson'
import { useDebounce } from '@/hooks/debounce/useDebounce'

export const useMediaSearch = (initialParams: IMediaQueryParams = {}) => {
  const [params, setParams] = useState<IMediaQueryParams>(initialParams)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debouncedSearchTerm,
      page: 1,
    }))
  }, [debouncedSearchTerm])

  const mediaQuery = useMedia(params)

  const handlePageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }))
  }

  const handlePerPageChange = (perPage: number) => {
    setParams((prev) => ({
      ...prev,
      per_page: perPage,
      page: 1,
    }))
  }

  const handleSortChange = (
    orderBy: string,
    direction: 'asc' | 'desc' = 'desc'
  ) => {
    setParams((prev) => ({
      ...prev,
      order_by: orderBy,
      direction,
    }))
  }

  const handleTypeFilter = (type?: string) => {
    setParams((prev) => ({
      ...prev,
      type,
      page: 1,
    }))
  }

  return {
    ...mediaQuery,
    params,
    searchTerm,
    setSearchTerm,
    handlePageChange,
    handlePerPageChange,
    handleSortChange,
    handleTypeFilter,
  }
}
