'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

import { useGetBlogBySlug } from '@/hooks/blog/useBlog'

import BlogDetailPost from '../_components/blog-detail/post'
import BlogDetailProfileItem from '../_components/blog-detail/profile-item'
import BlogDetailReviewList from '../_components/blog-detail/review-list'
import BlogDetailSharePost from '../_components/blog-detail/share-post'
import BlogDetailSimilarPosts from '../_components/blog-detail/similar-posts'
import Image from 'next/image'

const BlogDetailView = ({ slug }: { slug: string }) => {
  const { data: blogDetail, isLoading: isLoadingBlogDetail } =
    useGetBlogBySlug(slug)
  const postId = blogDetail?.data?.id

  if (isLoadingBlogDetail) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <section className="tf-spacing tf-spacing-3">
        <div className="page-blog-single">
          <div className="image-head">
            <Image
              className="lazyload h-[400px] w-full object-cover"
              src={blogDetail?.data?.thumbnail}
              alt={blogDetail?.data?.title}
              width={400}
              height={400}
            />
          </div>
          <div className="blog-single-wrap">
            <BlogDetailPost initialBlogDetail={blogDetail?.data} />
            <BlogDetailSharePost initialBlogDetail={blogDetail?.data} />
            <BlogDetailProfileItem initialBlogDetail={blogDetail?.data} />
            <div className="post-control flex flex-wrap items-center justify-between gap-[20px]">
              <BlogDetailReviewList postId={postId} />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- blog --> */}
      <section className="tf-spacing tf-spacing-1 pt-0">
        <BlogDetailSimilarPosts />
      </section>
      {/* <!-- /blog --> */}
    </div>
  )
}

export default BlogDetailView
