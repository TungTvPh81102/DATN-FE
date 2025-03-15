'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ExternalLink,
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Youtube,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useUpdateBioProfile } from '@/hooks/profile/useProfile'
import { ProfileBioFormValues, profileBioSchema } from '@/validations/profile'
import { cn } from '@/lib/utils'

interface Props {
  socialData?: any
}

const socialIcons = {
  github: <Github className="size-5" />,
  website: <Globe className="size-5" />,
  youtube: <Youtube className="size-5" />,
  facebook: <Facebook className="size-5" />,
  twitter: <Twitter className="size-5" />,
  linkedin: <Linkedin className="size-5" />,
  instagram: <Instagram className="size-5" />,
}

const socialLabels = {
  github: 'GitHub',
  website: 'Website',
  youtube: 'YouTube',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
}

const socialPlaceholders = {
  github: 'https://github.com/username',
  website: 'https://yourwebsite.com',
  youtube: 'https://youtube.com/@channel',
  facebook: 'https://facebook.com/profile',
  twitter: 'https://twitter.com/username',
  linkedin: 'https://linkedin.com/in/username',
  instagram: 'https://instagram.com/username',
}

export function SocialSection({ socialData }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const { mutate, isPending } = useUpdateBioProfile()
  const form = useForm<ProfileBioFormValues>({
    resolver: zodResolver(profileBioSchema),
    disabled: isPending,
  })

  useEffect(() => {
    if (socialData?.user?.profile?.bio) {
      const bioData = JSON.parse(socialData?.user?.profile?.bio)
      form.reset(bioData)
    }
  }, [socialData, form])

  function onSubmit(data: ProfileBioFormValues) {
    mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
      },
    })
  }

  const currentData = socialData?.user?.profile?.bio
    ? JSON.parse(socialData?.user?.profile?.bio)
    : {}

  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur-sm">
      <CardHeader
        className={cn(
          'justify-between gap-4 space-y-0 bg-gradient-to-r shadow-md sm:flex-row sm:items-center',
          'from-orange-50 to-orange-100'
        )}
      >
        <div>
          <CardTitle className="text-xl">Mạng xã hội</CardTitle>
          <CardDescription>
            Kết nối hồ sơ mạng xã hội và sự hiện diện trực tuyến của bạn
          </CardDescription>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        )}
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-4">
              {Object.entries(socialLabels).map(([key, label]) => (
                <div
                  key={key}
                  className="flex flex-col rounded-lg border bg-card text-card-foreground"
                >
                  <div className="flex flex-1 items-center gap-3 border-b p-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {socialIcons[key as keyof typeof socialIcons]}
                    </div>
                    <div>
                      <h4 className="font-medium">{label}</h4>
                      {!isEditing && currentData[key] && (
                        <a
                          href={currentData[key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          Truy cập đường dẫn{' '}
                          <ExternalLink className="ml-1 inline size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name={key as keyof ProfileBioFormValues}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={
                                  socialPlaceholders[
                                    key as keyof typeof socialPlaceholders
                                  ]
                                }
                                className="bg-background"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="truncate text-sm text-muted-foreground">
                        {currentData[key] || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  form.reset()
                }}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Cập nhật
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}
