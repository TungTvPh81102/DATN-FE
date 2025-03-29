'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, Flame, Loader2, Tag, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Container from '@/components/shared/container'
import { useGetPostBySlug } from '@/hooks/instructor/post/usePost'
import Image from 'next/image'

const PostDetailView = ({ slug }: { slug: string }) => {
  const { data: getPostBySlugData, isLoading } = useGetPostBySlug(slug)
  console.log('getPostBySlugData fdf', getPostBySlugData)

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }

  return (
    <Container>
      <div className="mt-8 grid grid-cols-[1fr,300px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                  {getPostBySlugData?.data.title}
                </h1>
                {getPostBySlugData?.data.is_hot === 1 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 p-2"
                  >
                    <Flame className="size-4 text-orange-500" />
                    Bài viết nổi bật
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{getPostBySlugData?.data.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>{getPostBySlugData?.data.published_at}</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg">
                {getPostBySlugData?.data?.thumbnail && (
                  <Image
                    src={getPostBySlugData.data.thumbnail}
                    alt={getPostBySlugData.data.title}
                    width={10000}
                    height={300}
                    className="h-[300px] w-[1200px] rounded-md object-cover"
                  />
                )}
              </div>

              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold">Mô tả</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPostBySlugData?.data.description,
                  }}
                />

                <h2 className="mt-6 text-xl font-semibold">Nội dung</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: getPostBySlugData?.data.content,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium">Danh mục</h2>
              <div className="mt-2 border-t"></div>
              <p className="mt-2">{getPostBySlugData?.data.category.name}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-medium">Tags</h2>
              <div className="mt-2 border-t"></div>
              <div className="mt-2 flex flex-wrap gap-2">
                {getPostBySlugData?.data.tags.map((tag: any, index: any) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="size-3" />
                    {tag?.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Link href="/instructor/posts">
              <Button variant="secondary">Quay lại danh sách</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default PostDetailView
