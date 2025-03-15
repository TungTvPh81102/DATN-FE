'use client'

import React from 'react'

import { useGetBlogs } from '@/hooks/blog/useBlog'

import BlogListBanner from '../_components/blog-list/banner'
import BlogListItem from '../_components/blog-list/item'
import BlogListSideBar from '../_components/blog-list/sidebar'

const BlogListView = () => {
  const { data: blogs, isLoading } = useGetBlogs()

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
                    initialBlogs={blogs?.data}
                  />
                </div>
                <BlogListSideBar />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogListView
