'use client'

import React from 'react'
import Image from 'next/image'
import { Download, Loader2 } from 'lucide-react'

import { useGetCertificates } from '@/hooks/user/useUser'
import { Button } from '@/components/ui/button'
import { PDFToImage } from '@/sections/my-courses/_components/pdf-to-image'
import { handleDownload } from '@/lib/utils'

const MyCertificateView = () => {
  const { data: myCertificateData, isLoading } = useGetCertificates()

  if (isLoading)
    return (
      <div className="mt-20">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )

  return (
    <section className="section-inner mt-10">
      {myCertificateData?.data.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myCertificateData?.data.map((certificate: any) => (
            <div
              key={certificate.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Mã chứng chỉ: {certificate.certificate_code}
                </h3>
                <p className="text-sm text-gray-500">
                  Ngày cấp:{' '}
                  {new Date(certificate.issued_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-4 overflow-hidden">
                <PDFToImage pdfUrl={certificate.file_path} />
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  className="flex w-full items-center gap-2"
                  onClick={() =>
                    handleDownload(
                      certificate.file_path,
                      `chung-chi-${certificate.certificate_code}.pdf`
                    )
                  }
                >
                  <Download size={16} /> Tải Chứng Chỉ
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[60vh] flex-col items-center justify-center">
          <Image
            src="/no-myCertificateData?.data.svg"
            alt="No Certificates"
            width={200}
            height={200}
          />
          <h2 className="mt-4 text-lg font-bold text-gray-700">
            Bạn chưa có chứng chỉ nào
          </h2>
          <p className="mt-2 text-gray-500">
            Chứng chỉ sẽ xuất hiện tại đây sau khi bạn hoàn thành các khóa học.
          </p>
        </div>
      )}
    </section>
  )
}

export default MyCertificateView
