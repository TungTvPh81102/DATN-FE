import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Bell, Heart, Share2 } from 'lucide-react'

export function LivestreamInfo({ liveSession }: any) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="size-12 border-2 border-primary">
              <AvatarImage
                src={liveSession?.data.instructor?.avatar}
                alt={liveSession?.instructor?.name}
              />
              <AvatarFallback>{liveSession?.instructor?.name}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">
                {liveSession?.data?.title || ''}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1">
                <span className="font-medium text-foreground">
                  {liveSession?.data?.instructor?.name || ''}
                </span>
                <span className="text-muted-foreground">• 24.5K followers</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Heart className="size-4" />
              <span>Follow</span>
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <Bell className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="size-8">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
