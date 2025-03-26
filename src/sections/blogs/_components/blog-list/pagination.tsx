import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BlogListPaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const BlogListPagination: React.FC<BlogListPaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(lastPage, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`mx-1 rounded-md px-4 py-2 ${
            currentPage === i
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-md p-2 ${
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronLeft className="size-5" />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`rounded-md p-2 ${
          currentPage === lastPage
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  )
}

export default BlogListPagination
