import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ListingsGridPaginationProps {
  currentPage: number

  totalPages: number

  onPageChange: (page: number) => void
}

export function ListingsGridPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ListingsGridPaginationProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:border-[#C6A15B] hover:text-[#C6A15B] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold transition-all
              ${
                page === currentPage
                  ? 'bg-[#C6A15B] text-white shadow-md'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-[#C6A15B] hover:text-[#C6A15B]'
              }
            `}
          >
            {page}
          </button>
        )
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition-all hover:border-[#C6A15B] hover:text-[#C6A15B] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}