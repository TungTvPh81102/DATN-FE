import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import React from 'react'

export const VisibilityBadge = ({
  visibility,
}: {
  visibility: 'public' | 'private'
}) => {
  const visibilityConfig = {
    public: {
      className: 'border-green-500 bg-green-50 text-green-700',
      dotClassName: 'bg-green-500',
      label: 'Công khai',
      icon: <Eye className="mr-2 size-4 text-green-500" />,
    },
    private: {
      className: 'border-red-500 bg-red-50 text-red-700',
      dotClassName: 'bg-red-500',
      label: 'Riêng tư',
      icon: <Eye className="mr-2 size-4 text-red-500" />,
    },
  }

  const config = visibilityConfig[visibility] || visibilityConfig.public

  return (
    <Badge
      variant="outline"
      className={`flex items-center ${config.className}`}
    >
      {config.icon}
      <div className={`mr-2 size-2 rounded-full ${config.dotClassName}`} />
      <span>{config.label}</span>
    </Badge>
  )
}
