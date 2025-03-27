'use client'

import { useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import {
  CreateChapterPayload,
  createChapterSchema,
} from '@/validations/chapter'
import { useCreateChapter } from '@/hooks/instructor/chapter/useChapter'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type Props = {
  onHide: () => void
}

const CreateChapter = ({ onHide }: Props) => {
  const { slug } = useParams()

  const { mutate: createChapter, isPending: isChapterCreating } =
    useCreateChapter()

  const form = useForm<CreateChapterPayload>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      slug: Array.isArray(slug) ? slug[0] : slug,
      title: '',
    },
  })

  const onSubmit = (values: CreateChapterPayload) => {
    if (isChapterCreating) return

    createChapter(values, {
      onSuccess: onHide,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-4 flex h-full flex-col justify-between rounded-lg border p-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chương học mới:</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-4 flex items-center justify-end">
            <Button onClick={onHide} className="mr-3" variant="secondary">
              Huỷ
            </Button>
            <Button type="submit" disabled={isChapterCreating}>
              {isChapterCreating ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Thêm'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
export default CreateChapter
