'use client'
import React from 'react'
import { useGetParticipatedMembership } from '@/hooks/instructor/transaction/useInstructorTransaction'

const TransactionManageMembershipView = () => {
  const { data, isLoading } = useGetParticipatedMembership()
  console.log('data', data)
  console.log('isLoading', isLoading)
  return <div></div>
}

export default TransactionManageMembershipView
