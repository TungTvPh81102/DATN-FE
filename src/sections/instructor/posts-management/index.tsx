'use client'

import Container from '@/components/shared/container'
import { PostsTable } from './_components/posts-table'

export const PostsManagement = () => {
  return (
    <Container>
      <h1 className="text-2xl font-medium">Quản lý bài viết</h1>

      <PostsTable />
    </Container>
  )
}
