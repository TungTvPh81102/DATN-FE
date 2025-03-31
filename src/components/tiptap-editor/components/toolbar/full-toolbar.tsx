import { Separator } from '@/components/ui/separator'
import type { Editor } from '@tiptap/react'
import { HistorySection } from '../section/history-section'
import { InsertElementSection } from '../section/insert-element-section'
import { ListsSection } from '../section/lists-section'
import { TextAlignSection } from '../section/text-align-section'
import { TextColorSection } from '../section/text-color-section'
import { TextFormattingSection } from '../section/text-formatting-section'
import { TextStylesSection } from '../section/text-styles-section'

export const FullToolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <HistorySection editor={editor} />
      <Separator orientation="vertical" className="mx-2 h-7" />

      <TextStylesSection editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <TextFormattingSection
        editor={editor}
        activeActions={[
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'code',
          'clearFormatting',
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <TextAlignSection editor={editor} mainActionCount={0} />
      <Separator orientation="vertical" className="mx-2 h-7" />

      <TextColorSection editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <ListsSection
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <InsertElementSection
        editor={editor}
        activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
        mainActionCount={0}
      />
    </div>
  </div>
)
