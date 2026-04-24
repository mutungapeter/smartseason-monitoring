import { ChevronLeft, ChevronRight } from 'lucide-react'

function buildRange(current, total, delta = 1) {
  if (total <= 1) return [1]
  const nums = new Set([1, total])
  for (let i = current - delta; i <= current + delta; i++) {
    if (i > 1 && i < total) nums.add(i)
  }
  const sorted = Array.from(nums).sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}

export function Pagination({ currentPage, totalItems, pageSize, onPageChange, className = '' }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const to   = Math.min(currentPage * pageSize, totalItems)
  const pages = buildRange(currentPage, totalPages)

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-2 ${className}`}>
      <p className="text-sm text-gray-500">
        {totalItems === 0 ? 'No records' : (
          <>
            Showing{' '}
            <span className="font-medium text-gray-700">{from}</span>
            {' – '}
            <span className="font-medium text-gray-700">{to}</span>
            {' of '}
            <span className="font-medium text-gray-700">{totalItems}</span>
            {' results'}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`gap-${i}`} className="inline-flex h-8 w-7 items-center justify-center text-sm text-gray-400 select-none">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md border px-2 text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}