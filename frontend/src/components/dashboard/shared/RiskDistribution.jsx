import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const RISK_CONFIG = {
  safe: { label: 'Safe', color: '#10B981' },
  warning: { label: 'Warning', color: '#F59E0B' },
  at_risk: { label: 'At Risk', color: '#EF4444' },
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

export default function RiskDistribution({ data }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: RISK_CONFIG[key]?.label || key,
    value,
    color: RISK_CONFIG[key]?.color || '#ccc',
  }))

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-poppins font-semibold text-gray-800 mb-1">
        Risk Distribution
      </h3>
      <p className="text-xs font-inter text-gray-400 mb-4">Fields by risk level</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          layout="vertical"
          barSize={28}
          margin={{ left: 10, right: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontFamily: 'Inter', fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontFamily: 'Inter', fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Fields">
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
