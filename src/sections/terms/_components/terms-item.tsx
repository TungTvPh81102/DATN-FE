type Props = {
  id: string
  terms: string[]
  title: string
  index: number
}

export const TermsItem = ({ id, terms, title, index }: Props) => {
  return (
    <section id={id} className="mt-6">
      <h2 className="mb-3 text-2xl font-semibold">
        {index}. {title}
      </h2>

      {terms.map((term) => (
        <p key={term}>{term}</p>
      ))}
    </section>
  )
}
