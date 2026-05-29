interface PaginationProps {
  currentPage: number

  totalPages: number

  onPageChange: (
    page: number,
  ) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {

  if (totalPages <= 1) {
    return null
  }

  const pages =
    Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    )

  return (
    <div className="flex justify-center py-16">

      <div className="flex items-center gap-3">

        {pages.map((page) => (

          <button
            key={page}
            onClick={() =>
              onPageChange(page)
            }
            className={
              page === currentPage
                ? 'h-12 w-12 rounded-xl bg-[#C6A15B] text-white'
                : 'h-12 w-12 rounded-xl border border-slate-200 bg-white'
            }
          >
            {page}
          </button>

        ))}

      </div>

    </div>
  )
}
