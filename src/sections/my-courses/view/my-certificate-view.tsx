'use client'

import React from 'react'
import { AlertTriangle, Download, Loader2 } from 'lucide-react'

import { useGetCertificates } from '@/hooks/user/useUser'
import { Button } from '@/components/ui/button'
import { handleDownload } from '@/lib/utils'

const MyCertificateView = () => {
  const { data: myCertificateData, isLoading } = useGetCertificates()

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2
            className="size-10 animate-spin"
            style={{ color: '#E27447' }}
          />
          <p className="text-sm" style={{ color: '#E27447' }}>
            Đang tải...
          </p>
        </div>
      </div>
    )

  return (
    <section className="section-inner mt-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
          Danh sách chứng chỉ
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Dưới đây là danh sách chứng chỉ mà bạn đã nhận được từ các khóa học.
        </p>
      </div>
      <div className="row">
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
                <div className="mt-4">
                  <iframe
                    src={certificate.file_path}
                    title={`Certificate-${certificate.certificate_code}`}
                    className="size-full rounded-md border"
                  ></iframe>
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
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center">
            <AlertTriangle className="mb-3 size-10 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Bạn chưa có chứng chỉ nào
            </h3>
            <p className="mt-2 text-gray-500">
              Chứng chỉ sẽ xuất hiện tại đây sau khi bạn hoàn thành các khóa
              học.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyCertificateView
