import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STAGE_CONFIG = {
  PLANTED: { label: 'Planted', color: '#06B6D4' },
  GROWING: { label: 'Growing', color: '#17AE9E' },
  READY: { label: 'Ready', color: '#10B981' },
  HARVESTED: { label: 'Harvested', color: '#64748b' },
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow p-3">
        <p className="font-inter text-sm font-medium text-gray-800">
          {payload[0].name}
        </p>
        <p className="font-inter text-sm text-gray-500">
          {payload[0].value} fields
        </p>
      </div>
    )
  }
  return null
}

export default function StageDistribution({ data }) {
  const chartData = data.map((item) => ({
    name: STAGE_CONFIG[item.current_stage]?.label || item.current_stage,
    value: item.count,
    color: STAGE_CONFIG[item.current_stage]?.color || '#ccc',
  }))

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-poppins font-semibold text-gray-800 mb-1">
        Stage Distribution
      </h3>
      <p className="text-xs font-inter text-gray-400 mb-4">Fields by growth stage</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="font-inter text-xs text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

