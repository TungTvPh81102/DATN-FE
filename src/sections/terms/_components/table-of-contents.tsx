import React from 'react'
import { terms } from '@/sections/terms/view/terms-view'

export const TableOfContents = () => {
  return (
    <div className="hidden w-96 lg:block">
      <div className="sticky top-4 mb-6 space-y-4 rounded-lg bg-gray-100 p-4 shadow-md">
        <h2 className="text-xl font-semibold">Mục Lục</h2>
        <ul className="space-y-2">
          {terms.map((term, index) => (
            <li key={term.id}>
              <a href={`#${term.id}`} className="text-blue-500">
                {index + 1}. {term.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
