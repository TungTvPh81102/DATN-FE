import { Award, Clock, CreditCard } from 'lucide-react'

export const getPlanType = (months: number) => {
  if (months === 3) {
    return {
      name: 'Tiết kiệm',
      icon: <Clock size={22} />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
    }
  }
  if (months === 6) {
    return {
      name: 'Tối ưu',
      icon: <CreditCard size={22} />,
      color: 'bg-gradient-to-r from-green-500 to-teal-500',
      textColor: 'text-green-600',
    }
  }
  return {
    name: 'Siêu lợi ích',
    icon: <Award size={22} />,
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    textColor: 'text-orange-600',
  }
}
