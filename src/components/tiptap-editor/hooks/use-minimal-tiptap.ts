import { cn } from '@/lib/utils'
import { uploadApi } from '@/services/upload'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Typography } from '@tiptap/extension-typography'
import { Underline } from '@tiptap/extension-underline'
import type { Content, Editor, UseEditorOptions } from '@tiptap/react'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import * as React from 'react'
import { toast } from 'react-toastify'
import {
  CodeBlockLowlight,
  Color,
  FileHandler,
  HorizontalRule,
  Image,
  Link,
  ResetMarksOnEnter,
  Selection,
  UnsetAllMarks,
} from '../extensions'
import { checkContentEmpty, fileToBase64, getOutput, randomId } from '../utils'
import { useThrottle } from './use-throttle'

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content
  output?: 'html' | 'json' | 'text'
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
}

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' },
  }),
  Link,
  Underline,
  Image.configure({
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: false,
    uploadFn: async (file) => {
      const { data: src } = await uploadApi.uploadImage(file)

      return { id: randomId(), src }
    },
    onToggle(editor, files, pos) {
      editor.commands.insertContentAt(
        pos,
        files.map((image) => {
          const blobUrl = URL.createObjectURL(image)
          const id = randomId()

          return {
            type: 'image',
            attrs: {
              id,
              src: blobUrl,
              alt: image.name,
              title: image.name,
              fileName: image.name,
            },
          }
        })
      )
    },
    onImageRemoved({ id, src }) {
      console.log('Image removed', { id, src })
    },
    onValidationError(errors) {
      errors.forEach((error) => {
        toast.error(error.reason)
      })
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: 'Sao chép hình ảnh',
        copyLink: 'Sao chép liên kết',
        download: 'Tải xuống',
      }
      toast.success(mapping[action] + ' thành công')
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: 'Sao chép hình ảnh',
        copyLink: 'Sao chép liên kết',
        download: 'Tải xuống',
      }
      toast.error(`${mapping[action]} thất bại`)
      console.error(`${mapping[action]} thất bại: ${error.message}`)
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: (editor, files, pos) => {
      files.forEach(async (file) => {
        const src = await fileToBase64(file)
        editor.commands.insertContentAt(pos, {
          type: 'image',
          attrs: { src },
        })
      })
    },
    onPaste: (editor, files) => {
      files.forEach(async (file) => {
        const src = await fileToBase64(file)
        editor.commands.insertContent({
          type: 'image',
          attrs: { src },
        })
      })
    },
    onValidationError: (errors) => {
      errors.forEach((error) => {
        toast.error(error.reason)
      })
    },
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]

export const useMinimalTiptapEditor = ({
  value,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 500,
  onUpdate,
  onBlur,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(!checkContentEmpty(value) ? value : ''),
    throttleDelay
  )

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value)
      }
    },
    [value]
  )

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  )

  const editor = useEditor({
    extensions: createExtensions(placeholder),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  })

  return editor
}

export default useMinimalTiptapEditor
