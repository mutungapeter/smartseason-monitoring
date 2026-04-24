export default function FieldDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* back + title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-200" />
        <div className="h-6 w-40 bg-gray-200 rounded" />
      </div>

      {/* top card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}