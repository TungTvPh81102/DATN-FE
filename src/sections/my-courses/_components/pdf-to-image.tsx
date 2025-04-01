'use client'
import React, { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/build/pdf.worker.entry'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export const PDFToImage = ({ pdfUrl }: { pdfUrl: string }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        const page = await pdf.getPage(1)

        const scale = 2
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        if (!context) return

        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = { canvasContext: context, viewport }
        await page.render(renderContext).promise

        setImageSrc(canvas.toDataURL('image/png'))
      } catch (error) {
        console.error('Error rendering PDF:', error)
      }
    })()
  }, [pdfUrl])

  return imageSrc ? (
    <Image src={imageSrc} alt="PDF Preview" width={500} height={700} />
  ) : (
    <Loader2 className="mx-auto size-8 animate-spin" />
  )
}
