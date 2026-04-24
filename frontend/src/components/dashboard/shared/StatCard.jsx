export default function StatCard({ label, value, color = 'primary', icon: Icon }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
    info: 'bg-info-50 text-info-700',
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-inter text-gray-500">{label}</span>
        {Icon && (
          <span className={`p-2 rounded-lg ${colorMap[color]}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className={`text-3xl font-poppins font-semibold ${colorMap[color].split(' ')[1]}`}>
        {value}
      </p>
    </div>
  )
}

