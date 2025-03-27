import Link from 'next/link'
import { Document, Page } from 'react-pdf'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DocumentDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  documentFile?: string | null
}

const DialogDocumentPreview: React.FC<DocumentDialogProps> = ({
  isOpen,
  setIsOpen,
  documentFile,
}) => {
  const fileType = null
  const docxContent = ''

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tài liệu của bài học</DialogTitle>
        </DialogHeader>
        {documentFile ? (
          <>
            {fileType === 'pdf' ? (
              <Document file={documentFile}>
                <Page pageNumber={1} />
              </Document>
            ) : fileType === 'docx' ? (
              <div dangerouslySetInnerHTML={{ __html: docxContent }} />
            ) : (
              <DialogDescription>
                Không hỗ trợ xem trước.{' '}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={documentFile}
                  download
                  className="text-blue-500 underline"
                >
                  Tải xuống tại đây
                </Link>
              </DialogDescription>
            )}
          </>
        ) : (
          <DialogDescription>Chưa có tài liệu.</DialogDescription>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogDocumentPreview
