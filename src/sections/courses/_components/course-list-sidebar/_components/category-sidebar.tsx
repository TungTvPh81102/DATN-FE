import React from 'react'

import { ICourseFilter } from '@/types'
import { ICategory } from '@/types/Category'

type Props = {
  categories: ICategory[]
  dataFilters: ICourseFilter
  setDataFilters: React.Dispatch<React.SetStateAction<ICourseFilter>>
}

export const CategorySidebar = ({
  dataFilters,
  categories,
  setDataFilters,
}: Props) => {
  const handleCategoryChange = (categorySlug: string) => {
    setDataFilters((prev) => {
      const updatedCategories = prev.categories?.includes(categorySlug)
        ? prev.categories.filter((id) => id !== categorySlug)
        : [...(prev.categories || []), categorySlug]

      const newFilters = { ...prev, categories: updatedCategories }

      localStorage.setItem('courseFilters', JSON.stringify(newFilters))

      return newFilters
    })
  }

  return (
    <div className="sidebar-item widget wg-categorie tf-collapse-item">
      <div className="sidebar-title tf-collapse-title">
        <h5 className="fw-5">Danh mục</h5>
      </div>
      <ul className="tf-collapse-content">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li className="checkbox-item fl-item2" key={category?.id}>
              <label>
                <p>{category?.name}</p>
                <input
                  name="category"
                  type="checkbox"
                  value={category?.id}
                  checked={
                    dataFilters?.categories?.includes(category?.slug) ?? false
                  }
                  onChange={() => handleCategoryChange(category?.slug)}
                />
                <span className="btn-checkbox" />
              </label>
            </li>
          ))
        ) : (
          <p>Không có danh mục nào</p>
        )}
      </ul>
      {/*<div className="btn-showmore showmore views-more-button">*/}
      {/*  <span className="title">*/}
      {/*    Xem thêm <i className="icon icon-arrow-bottom" />*/}
      {/*  </span>*/}
      {/*</div>*/}
    </div>
  )
}
