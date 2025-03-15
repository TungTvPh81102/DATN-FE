import { useMutation } from '@tanstack/react-query'

import { paymentApi } from '@/services/payment/payment-api'

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (data: any) => paymentApi.createPayment(data),
  })
}
