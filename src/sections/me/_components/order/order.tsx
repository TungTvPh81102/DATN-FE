'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { formatCurrency, formatDate } from '@/lib/common'
import { useGetOrderById, useGetOrders } from '@/hooks/order/useOrder'

import OrderDetailView from '@/sections/me/_components/order/order-detail'

const MeOrder = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<number | undefined>(
    undefined
  )
  const { data: getOrderlistData, isLoading: isLoadingOrder } = useGetOrders()
  const { data: getOrderByIdData, isLoading: isLoadingOrderDetail } =
    useGetOrderById(selectedOrderId)

  if (isLoadingOrder || isLoadingOrderDetail) {
    return (
      <div className="mt-10">
        <Loader2 className="mx-auto size-8 animate-spin" />
      </div>
    )
  }
  const handleViewOrder = (orderId: number) => {
    setSelectedOrderId(orderId)
  }

  const handleBackToList = () => {
    setSelectedOrderId(undefined)
  }

  if (selectedOrderId && getOrderByIdData) {
    return (
      <OrderDetailView
        getOrderByIdData={getOrderByIdData}
        onBack={handleBackToList}
      />
    )
  }

  return (
    <div className="section-order-right">
      <div className="heading-section pb-13 border-bottom">
        <h6 className="fs-22 fw-5 wow fadeInUp">Lịch sử đơn hàng</h6>
      </div>
      <div className="wg-box">
        <div className="table-order wow fadeInUp">
          <div className="head">
            <div className="item">
              <div className="fs-15 fw-5">ID</div>
            </div>
            <div className="item">
              <div className="fs-15 fw-5">Tên khóa học</div>
            </div>
            <div className="item">
              <div className="fs-15 fw-5">Ngày mua</div>
            </div>
            <div className="item">
              <div className="fs-15 fw-5">Giá</div>
            </div>
            <div className="item">
              <div className="fs-15 fw-5">Hành động</div>
            </div>
          </div>

          <ul>
            {getOrderlistData?.data.map((order: any) => (
              <li key={order.id}>
                <div className="order-item item border-bottom">
                  <div>
                    <p className="fs-15 fw-5">{order.id}</p>
                  </div>
                  <div>
                    <a href="#" className="fs-15 fw-5">
                      {order?.course?.name?.length > 20
                        ? order.course.name.slice(0, 20) + '...'
                        : order?.course?.name}
                    </a>
                  </div>
                  <div>
                    <p className="fs-15 fw-5">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="fs-15 fw-5">
                      {formatCurrency(order?.final_amount)}
                    </p>
                  </div>
                  <div>
                    <div className="actions btn-style-2 fs-15 d-flex align-items-center justify-content-center">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="btn-edit btn"
                      >
                        <i className="flaticon-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
export default MeOrder
