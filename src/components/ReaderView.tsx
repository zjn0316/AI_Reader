interface ReaderViewProps {
  paragraphs: string[]
  fontSize: number
}

export function ReaderView({ paragraphs, fontSize }: ReaderViewProps) {
  return (
    <article
      className="reader-view"
      data-testid="reader-view"
      style={{ fontSize }}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  )
}
