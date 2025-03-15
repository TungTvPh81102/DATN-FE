import React from 'react'
import { ICourseDataResponse } from '@/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  data: ICourseDataResponse
  handlePageChange: (pageUrl?: string | null) => void
}

export const CoursePagination = ({ data, handlePageChange }: Props) => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Showing page</span>
        <span className="font-medium text-gray-900">
          {data.current_page} of {data.last_page}
        </span>
      </div>

      <div className="flex items-center">
        <ul className="flex items-center gap-2 rounded-lg shadow-sm">
          {data.links.map((link, index) => {
            const isEllipsis = link.label.includes('...')
            const isPrevious = link.label.includes('&laquo;')
            const isNext = link.label.includes('&raquo;')

            const baseClasses =
              'flex items-center justify-center h-10 transition-all duration-200'

            const numberClasses = 'w-10 text-sm font-medium'

            const arrowClasses = 'w-12 px-1'

            const activeClasses = link.active
              ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-200'
              : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-200'

            const disabledClasses = !link.url
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105'

            return (
              <li key={index}>
                {isEllipsis ? (
                  <span className="flex size-10 items-center justify-center text-gray-500">
                    ···
                  </span>
                ) : (
                  <button
                    className={` ${baseClasses} ${isPrevious || isNext ? arrowClasses : numberClasses} ${activeClasses} ${disabledClasses} rounded-md`}
                    onClick={() => {
                      if (link.url) {
                        handlePageChange(link.url)
                      }
                    }}
                    disabled={!link.url}
                    aria-label={
                      isPrevious
                        ? 'Previous page'
                        : isNext
                          ? 'Next page'
                          : `Page ${link.label}`
                    }
                  >
                    {isPrevious ? (
                      <ChevronLeft size={18} className="mx-auto" />
                    ) : isNext ? (
                      <ChevronRight size={18} className="mx-auto" />
                    ) : (
                      link.label
                    )}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
