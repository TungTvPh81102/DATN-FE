'use client'

import React, { useState } from 'react'
import {
  useGetBlogs,
  useGetBlogsOfCategory,
  useGetBlogsOfTags,
} from '@/hooks/blog/useBlog'
import BlogListBanner from '../_components/blog-list/banner'
import BlogListItem from '../_components/blog-list/item'
import BlogListSideBar from '../_components/blog-list/sidebar'
import BlogListPagination from '@/sections/blogs/_components/blog-list/pagination'
import { Blog } from '@/types/Blogs'

const BlogListView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 4

  const { data: allBlogs, isLoading: isLoadingAll } = useGetBlogs()
  const { data: categoryBlogs, isLoading: isLoadingCategory } =
    useGetBlogsOfCategory(selectedCategory || '')
  const { data: tagsBlogs, isLoading: isLoadingTags } = useGetBlogsOfTags(
    selectedTags || ''
  )

  const blogs = selectedTags
    ? tagsBlogs?.data
    : selectedCategory
      ? categoryBlogs?.data
      : allBlogs?.data

  const isLoading = selectedTags
    ? isLoadingTags
    : selectedCategory
      ? isLoadingCategory
      : isLoadingAll

  const filteredBlogs = blogs
    ? {
        data: blogs.filter(
          (blog: Blog) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : { data: [] }

  const totalItems = filteredBlogs.data.length
  const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return {
      data: filteredBlogs.data.slice(startIndex, endIndex),
      pagination: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: ITEMS_PER_PAGE,
        total: totalItems,
      },
    }
  }

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug)
    setSelectedTags(null)
    setSearchQuery('')
    setCurrentPage(1)
  }
  const handleTagClick = (slug: string) => {
    setSelectedTags(slug)
    setSelectedCategory(null)
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getEmptyStateMessage = () => {
    if (isLoading) return null
    if (selectedCategory) {
      return 'Danh mục này chưa có bài viết nào.'
    }
    if (selectedTags) {
      return 'Thẻ này chưa có bài viết nào.'
    }
    if (searchQuery) {
      return 'Không tìm thấy bài viết nào phù hợp với từ khóa tìm kiếm.'
    }
    return 'Chưa có bài viết nào.'
  }

  return (
    <div>
      <BlogListBanner />
      <section className="mt-12">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="page-blog-list">
                <div className="left">
                  {!isLoading && filteredBlogs.data.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-white p-8 text-center text-gray-500">
                      <p>{getEmptyStateMessage()}</p>
                    </div>
                  ) : (
                    <>
                      <BlogListItem
                        isLoading={isLoading}
                        initialBlogs={getCurrentPageItems()}
                      />
                      {!isLoading && filteredBlogs.data.length > 0 && (
                        <BlogListPagination
                          currentPage={currentPage}
                          lastPage={lastPage}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </>
                  )}
                </div>
                <BlogListSideBar
                  onCategoryClick={handleCategoryClick}
                  selectedCategory={selectedCategory}
                  onTagClick={handleTagClick}
                  selectedTags={selectedTags}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogListView
