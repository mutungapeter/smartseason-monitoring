import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow p-3">
        <p className="font-inter text-xs text-gray-500 mb-1">Week {label}</p>
        <p className="font-inter text-sm font-medium text-gray-800">
          {payload[0].value} observations
        </p>
      </div>
    )
  }
  return null
}

export default function ObservationTrend({ data }) {
  const chartData = data.map((item) => ({
    week: `W${item.period.split('-')[1]}`,
    observations: item.observations,
  }))

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="font-poppins font-semibold text-gray-800 mb-1">
        Observation Trend
      </h3>
      <p className="text-xs font-inter text-gray-400 mb-4">Weekly activity</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontFamily: 'Inter', fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontFamily: 'Inter', fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
          <Bar dataKey="observations" fill="#17AE9E" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

