'use client'

import { Language, LANGUAGE_CONFIG } from '@/constants/language'
import { formatDate } from '@/lib/common'

import HtmlRenderer from '@/components/shared/html-renderer'
import MonacoEditor from '@/components/shared/monaco-editor'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DraftLesson } from '@/types/DraftCourse'

type Props = {
  lesson: DraftLesson
}

const DraftCodingLesson = ({ lesson }: Props) => {
  const language = lesson?.language as Language

  const { fileName, version } = LANGUAGE_CONFIG[language]
  const files = {
    [fileName]: {
      name: fileName,
      language,
      value: lesson?.sample_code || '',
      version,
    },
  }

  return (
    <div className="relative h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={30}>
          <Tabs defaultValue="instruct" className="flex h-full flex-col">
            <TabsList variant="outline" className="h-12 px-8">
              <TabsTrigger
                value="instruct"
                variant="outline"
                className="h-12 min-w-32 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
              >
                NỘI DUNG
              </TabsTrigger>
              <TabsTrigger
                value="hints"
                variant="outline"
                className="h-12 min-w-32 border-b-2 text-base duration-500 data-[state=active]:text-primary data-[state=active]:focus:bg-primary/5"
              >
                GỢI Ý
              </TabsTrigger>
            </TabsList>
            <div className="h-full overflow-y-auto p-8 pb-20 scrollbar-thin lg:px-16">
              <TabsContent value="instruct">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{lesson.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Cập nhật{' '}
                    {formatDate(lesson.updated_at, {
                      dateStyle: 'long',
                    })}
                  </p>
                </div>

                <HtmlRenderer html={lesson.content} className="mt-8" />
                {lesson.instruct && (
                  <HtmlRenderer html={lesson.instruct} className="mt-8" />
                )}
              </TabsContent>
              <TabsContent value="hints" className="prose">
                <ol>
                  {lesson?.hints?.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ol>
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel minSize={20}>
          <MonacoEditor
            files={files}
            readOnly={true}
            activeFileGroup={'solution'}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default DraftCodingLesson
