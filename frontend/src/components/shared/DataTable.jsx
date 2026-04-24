function renderCellValue(value) {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return value.toString()
  if (value instanceof Date) return value.toLocaleDateString()
  if (Array.isArray(value)) return value.map((v) => String(v)).join(', ')
  return JSON.stringify(value)
}

const BORDER_CLASSES = {
  top:    'border-t border-gray-200',
  right:  'border-r border-gray-200',
  bottom: 'border-b border-gray-200',
  left:   'border-l border-gray-200',
}

function resolveBorderClasses(borders) {
  if (!borders || borders === 'all') return 'border border-gray-200'
  if (borders === 'none')            return ''
  return borders.map(side => BORDER_CLASSES[side]).join(' ')
}

function DataTable({
  data,
  columns,
  isLoading = false,
  error = null,
  stripedRows = true,
  stripeColor = 'bg-gray-50',
  borders = 'all',
}) {
  const getRowBg = (index) =>
    stripedRows && index % 2 === 0 ? stripeColor : 'bg-white'

  const borderClasses = resolveBorderClasses(borders)

  return (
    <div className={`relative w-full overflow-x-auto ${borderClasses}`}>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map((col, i) => (
              <th
                key={String(col.accessor ?? i)}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-gray-400">
                Loading...
              </td>
            </tr>

          ) : error ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-sm text-red-500">
                {typeof error === 'string' ? error : 'Error loading data'}
              </td>
            </tr>

          ) : data.length > 0 ? (
            data.map((row, rowIndex) => {
              const rowKey = String(row.id ?? rowIndex)
              return (
                <tr
                  key={rowKey}
                  className={`hover:bg-green-50/40 transition-colors ${getRowBg(rowIndex)}`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`${rowKey}-${String(col.accessor ?? colIndex)}`}
                      className={`px-4 py-3 text-left text-sm whitespace-normal break-words
                        ${col.textColor ?? 'text-gray-700'}`}
                    >
                      {col.cell ? col.cell(row) : renderCellValue(row[col.accessor])}
                    </td>
                  ))}
                </tr>
              )
            })

          ) : (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-gray-400">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable