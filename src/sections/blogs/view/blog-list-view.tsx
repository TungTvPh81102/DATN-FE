'use client'

import React, { useState } from 'react'

import { useGetBlogs, useGetBlogsOfCategory } from '@/hooks/blog/useBlog'

import BlogListBanner from '../_components/blog-list/banner'
import BlogListItem from '../_components/blog-list/item'
import BlogListSideBar from '../_components/blog-list/sidebar'
import BlogListPagination from '@/sections/blogs/_components/blog-list/pagination'

const BlogListView = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const { data: allBlogs, isLoading: isLoadingAll } = useGetBlogs()

  const { data: categoryBlogs, isLoading: isLoadingCategory } =
    useGetBlogsOfCategory(selectedCategory || '')

  const blogs = selectedCategory ? categoryBlogs : allBlogs

  const isLoading = selectedCategory ? isLoadingCategory : isLoadingAll
  const filteredBlogs = blogs?.data
    ? {
        data: blogs.data.filter(
          (blog: any) =>
            blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            blog.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : blogs
  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug)
    setSearchQuery('')
  }
  const handleSearch = (query: string) => {
    setSearchQuery(query)
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
                  <BlogListItem
                    isLoading={isLoading}
                    initialBlogs={filteredBlogs}
                  />
                  <BlogListPagination />
                </div>
                <BlogListSideBar
                  onCategoryClick={handleCategoryClick}
                  selectedCategory={selectedCategory}
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
