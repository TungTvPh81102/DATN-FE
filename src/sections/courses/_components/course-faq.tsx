'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface CourseFAQProps {
  faqs: FAQItem[]
}

const CourseFaq = ({ faqs }: CourseFAQProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="mt-8">
      <h2 className="text-22 fw-5 wow fadeInUp mb-6" data-wow-delay="0s">
        Câu hỏi thường gặp
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`flex w-full items-center justify-between px-6 py-4 text-left transition ${
                expandedIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'
              }`}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {faq.question}
              </h3>
              <ChevronDown
                className={`size-5 text-gray-400 transition-transform duration-300 ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="border-t border-gray-100 px-6 py-4">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseFaq
