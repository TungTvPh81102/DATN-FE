import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface BlogDetailPostProps {
  initialBlogDetail: any
}

const BlogDetailProfileItem = ({ initialBlogDetail }: BlogDetailPostProps) => {
  const userName = initialBlogDetail?.user?.name
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
  const aboutMe =
    initialBlogDetail?.user?.profile?.about_me || 'Chưa được cập nhật'
  const truncatedAboutMe =
    aboutMe?.length > 200 ? aboutMe.slice(0, 200) + '...' : aboutMe

  return (
    <Card className="overflow-hidden border-0 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-24 border-2 border-gray-100 shadow-sm">
            <AvatarImage
              src={initialBlogDetail?.user?.avatar}
              alt={userName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 font-medium text-gray-800">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-semibold tracking-tight transition-colors hover:text-primary focus:underline focus:outline-none">
              {userName}
            </h3>

            <p className="text-sm leading-relaxed text-gray-600">
              {truncatedAboutMe}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BlogDetailProfileItem
