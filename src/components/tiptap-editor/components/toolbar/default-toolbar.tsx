import type { Editor } from '@tiptap/react'
import { TextFormattingSection } from '../section/text-formatting-section'
import { ListsSection } from '../section/lists-section'

export const DefaultToolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <TextFormattingSection
        editor={editor}
        activeActions={['bold', 'italic', 'underline', 'strikethrough']}
        mainActionCount={4}
      />

      <ListsSection
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={2}
      />
    </div>
  </div>
)
