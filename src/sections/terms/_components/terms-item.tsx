type Props = {
  id: string
  terms: string[]
  title: string
  index: number
}

export const TermsItem = ({ id, terms, title, index }: Props) => {
  return (
    <section
      id={id}
      className="mb-8 rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h2 className="mb-4 border-b pb-2 text-2xl font-bold text-gray-800">
        {index}. {title}
      </h2>
      <div className="space-y-2">
        {terms.map((term, termIndex) => (
          <p key={termIndex} className="leading-relaxed text-gray-600">
            {term}
          </p>
        ))}
      </div>
    </section>
  )
}
