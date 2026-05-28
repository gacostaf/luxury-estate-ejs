interface SimilarListingsCarouselHeaderProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}
export function SimilarListingsCarouselHeader({
  title = 'Similar Properties',
  subtitle,
  children,
}: SimilarListingsCarouselHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {title && (
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        )}
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}
