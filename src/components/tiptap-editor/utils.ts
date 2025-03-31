import type { Content, Editor } from '@tiptap/react'
import type { TiptapProps } from './tiptap-editor'

type ShortcutKeyResult = {
  symbol: string
  readable: string
}

export enum Reason {
  Type = 'Loại không hợp lệ',
  Size = 'Kích thước không hợp lệ',
  InvalidBase64 = 'Base64 không hợp lệ',
  Base64NotAllowed = 'Base64 không được phép',
}

export type FileError = {
  file: File | string
  reason: Reason
}

export type FileValidationOptions = {
  allowedMimeTypes: string[]
  maxFileSize?: number
  allowBase64: boolean
}

type FileInput = File | { src: string | File; alt?: string; title?: string }

export const isClient = (): boolean => typeof window !== 'undefined'
export const isServer = (): boolean => !isClient()
export const isMacOS = (): boolean =>
  isClient() && window.navigator.platform === 'MacIntel'

const shortcutKeyMap: Record<string, ShortcutKeyResult> = {
  mod: isMacOS()
    ? { symbol: '⌘', readable: 'Command' }
    : { symbol: 'Ctrl', readable: 'Control' },
  alt: isMacOS()
    ? { symbol: '⌥', readable: 'Option' }
    : { symbol: 'Alt', readable: 'Alt' },
  shift: { symbol: '⇧', readable: 'Shift' },
}

export const getShortcutKey = (key: string): ShortcutKeyResult =>
  shortcutKeyMap[key.toLowerCase()] || { symbol: key, readable: key }

export const getShortcutKeys = (keys: string[]): ShortcutKeyResult[] =>
  keys.map(getShortcutKey)

export const getOutput = (
  editor: Editor,
  format: TiptapProps['output']
): object | string => {
  switch (format) {
    case 'json':
      return editor.getJSON()
    case 'html':
      return editor.isEmpty ? '' : editor.getHTML()
    default:
      return editor.getText()
  }
}

export const isUrl = (
  text: string,
  options: { requireHostname: boolean; allowBase64?: boolean } = {
    requireHostname: false,
  }
): boolean => {
  if (text.includes('\n')) return false

  try {
    const url = new URL(text)
    const blockedProtocols = [
      'javascript:',
      'file:',
      'vbscript:',
      ...(options.allowBase64 ? [] : ['data:']),
    ]

    if (blockedProtocols.includes(url.protocol)) return false
    if (options.allowBase64 && url.protocol === 'data:')
      return /^data:image\/[a-z]+;base64,/.test(text)
    if (url.hostname) return true

    return (
      url.protocol !== '' &&
      (url.pathname.startsWith('//') || url.pathname.startsWith('http')) &&
      !options.requireHostname
    )
  } catch {
    return false
  }
}

export const sanitizeUrl = (
  url: string | null | undefined,
  options: { allowBase64?: boolean } = {}
): string | undefined => {
  if (!url) return undefined

  if (options.allowBase64 && url.startsWith('data:image')) {
    return isUrl(url, { requireHostname: false, allowBase64: true })
      ? url
      : undefined
  }

  return isUrl(url, {
    requireHostname: false,
    allowBase64: options.allowBase64,
  }) || /^(\/|#|mailto:|sms:|fax:|tel:)/.test(url)
    ? url
    : `https://${url}`
}

export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Không thể chuyển đổi Blob sang base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export const randomId = (): string => Math.random().toString(36).slice(2, 11)

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Không thể chuyển đổi File sang base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const validateFileOrBase64 = <T extends FileInput>(
  input: File | string,
  options: FileValidationOptions,
  originalFile: T,
  validFiles: T[],
  errors: FileError[]
): void => {
  const { isValidType, isValidSize } = checkTypeAndSize(input, options)

  if (isValidType && isValidSize) {
    validFiles.push(originalFile)
  } else {
    if (!isValidType) errors.push({ file: input, reason: Reason.Type })
    if (!isValidSize) errors.push({ file: input, reason: Reason.Size })
  }
}

const checkTypeAndSize = (
  input: File | string,
  { allowedMimeTypes, maxFileSize }: FileValidationOptions
): { isValidType: boolean; isValidSize: boolean } => {
  const mimeType = input instanceof File ? input.type : base64MimeType(input)
  const size =
    input instanceof File ? input.size : atob(input.split(',')[1]).length

  const isValidType =
    allowedMimeTypes.length === 0 ||
    allowedMimeTypes.includes(mimeType) ||
    allowedMimeTypes.includes(`${mimeType.split('/')[0]}/*`)

  const isValidSize = !maxFileSize || size <= maxFileSize

  return { isValidType, isValidSize }
}

const base64MimeType = (encoded: string): string => {
  const result = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  return result && result.length > 1 ? result[1] : 'unknown'
}

const isBase64 = (str: string): boolean => {
  if (str.startsWith('data:')) {
    const matches = str.match(/^data:[^;]+;base64,(.+)$/)
    if (matches && matches[1]) {
      str = matches[1]
    } else {
      return false
    }
  }

  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}

export const filterFiles = <T extends FileInput>(
  files: T[],
  options: FileValidationOptions
): [T[], FileError[]] => {
  const validFiles: T[] = []
  const errors: FileError[] = []

  files.forEach((file) => {
    const actualFile = 'src' in file ? file.src : file

    if (actualFile instanceof File) {
      validateFileOrBase64(actualFile, options, file, validFiles, errors)
    } else if (typeof actualFile === 'string') {
      if (isBase64(actualFile)) {
        if (options.allowBase64) {
          validateFileOrBase64(actualFile, options, file, validFiles, errors)
        } else {
          errors.push({ file: actualFile, reason: Reason.Base64NotAllowed })
        }
      } else {
        if (!sanitizeUrl(actualFile, { allowBase64: options.allowBase64 })) {
          errors.push({ file: actualFile, reason: Reason.InvalidBase64 })
        } else {
          validFiles.push(file)
        }
      }
    }
  })

  return [validFiles, errors]
}

export const checkContentEmpty = (content: Content): boolean => {
  if (!content) return true

  // Nếu content là chuỗi HTML
  if (typeof content === 'string') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    // Lấy toàn bộ text và loại bỏ khoảng trắng, dấu cách không ngắt
    const text = doc.body.textContent?.replace(/\u00A0/g, '').trim()
    return !text
  }

  // Nếu content là JSON (object) theo cấu trúc của Tiptap,
  // duyệt đệ quy qua các node để kiểm tra có text hợp lệ hay không.
  const hasMeaningfulText = (node: any): boolean => {
    // Nếu là node text, kiểm tra text
    if (node.type === 'text') {
      const text = (node.text || '').replace(/\u00A0/g, '').trim()
      return !!text
    }

    // Nếu node có mảng content, duyệt qua từng node con
    if (node.content && Array.isArray(node.content)) {
      return node.content.some(hasMeaningfulText)
    }

    return false
  }

  return !hasMeaningfulText(content)
}
