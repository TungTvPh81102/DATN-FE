import { useQuery } from '@tanstack/react-query'

import QueryKey from '@/constants/query-key'
import { blogApi } from '@/services/blog/post-api'

export const useGetBlogs = () => {
  return useQuery({
    queryKey: [QueryKey.BLOGS],
    queryFn: () => blogApi.getBlogs(),
  })
}

export const useGetBlogBySlug = (slug?: string) => {
  return useQuery({
    queryKey: [QueryKey.BLOGS, slug],
    queryFn: () => blogApi.getBlogBySlug(slug!),
    enabled: !!slug,
  })
}
export const useGetBlogsOfCategory = (slug: string) => {
  return useQuery({
    queryKey: [QueryKey.BLOGS, slug],
    queryFn: () => blogApi.getCategoryBlogs(slug),
    enabled: !!slug,
  })
}
export const useGetBlogsOfTags = (slug: string) => {
  return useQuery({
    queryKey: [QueryKey.BLOGS, slug],
    queryFn: () => blogApi.getTagsBlogs(slug),
    enabled: !!slug,
  })
}
