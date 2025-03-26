'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { useGetBlogBySlug } from '@/hooks/blog/useBlog'
import BlogDetailPost from '../_components/blog-detail/post'
import BlogDetailProfileItem from '../_components/blog-detail/profile-item'
import BlogDetaiCommentsList from '../_components/blog-detail/comment-list'
import BlogDetailSharePost from '../_components/blog-detail/share-post'
import BlogDetailSimilarPosts from '../_components/blog-detail/similar-posts'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const BlogDetailView = ({ slug }: { slug: string }) => {
  const {
    data: blogDetail,
    isLoading: isLoadingBlogDetail,
    error,
  } = useGetBlogBySlug(slug)

  if (isLoadingBlogDetail) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  if (error || !blogDetail?.data) {
    return notFound()
  }

  const postId = blogDetail?.data?.id
  const categorySlug = blogDetail?.data?.category?.slug

  return (
    <div>
      <section>
        <div className="page-blog-single">
          <div className="image-head mt-10">
            <Image
              className="lazyload h-[400px] w-full object-cover"
              src={blogDetail?.data?.thumbnail}
              alt={blogDetail?.data?.title}
              width={400}
              height={400}
            />
          </div>
          <div className="blog-single-wrap">
            <BlogDetailPost
              initialBlogDetail={blogDetail?.data}
              document={blogDetail?.data}
            />
            <BlogDetailSharePost initialBlogDetail={blogDetail?.data} />
            <BlogDetailProfileItem initialBlogDetail={blogDetail?.data} />
            <div className="post-control flex flex-wrap items-center justify-between gap-[20px]">
              <BlogDetaiCommentsList postId={postId} />
            </div>
          </div>
        </div>
      </section>
      {/*<section className="mb-10">*/}
      {/*  <BlogDetailSimilarPosts />*/}
      {/*</section>*/}
      {categorySlug && (
        <section className="mb-10">
          <BlogDetailSimilarPosts
            categorySlug={categorySlug}
            currentPostId={postId}
          />
        </section>
      )}
    </div>
  )
}

export default BlogDetailView
