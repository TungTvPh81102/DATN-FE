'use client'

import React from 'react'

import { useGetBlogs } from '@/hooks/blog/useBlog'

import BlogListBanner from '../_components/blog-list/banner'
import BlogListItem from '../_components/blog-list/item'
import BlogListSideBar from '../_components/blog-list/sidebar'
import { Loader2 } from 'lucide-react'

const BlogListView = () => {
  const { data: blogs, isLoading } = useGetBlogs()
  if (isLoading) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <BlogListBanner />
      <section className="tf-spacing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="page-blog-list">
                <div className="left">
                  <BlogListItem initialBlogs={blogs?.data} />
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
