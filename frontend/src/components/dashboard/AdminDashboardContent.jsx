import { Layers, CheckCircle, AlertTriangle, Sprout } from 'lucide-react'
import StatCard from './shared/StatCard'
import StageDistribution from './shared/StageDistribution'
import RiskDistribution from './shared/RiskDistribution'
import ObservationTrend from './shared/ObservationTrend'

export default function AdminDashboard({ data }) {
  const {
    overview,
    field_stage_distribution,
    field_risk_distribution,
    observation_trend,
    agent_performance,
  } = data

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-poppins font-semibold text-xl text-gray-800">
          Admin Dashboard
        </h2>
        <p className="text-sm font-inter text-gray-500">
          Overview of all fields this season
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Fields" value={overview.total_fields} color="primary" icon={Layers} />
        <StatCard label="Active" value={overview.active_fields} color="success" icon={Sprout} />
        <StatCard label="Completed" value={overview.completed_fields} color="info" icon={CheckCircle} />
        <StatCard label="At Risk" value={overview.at_risk_fields} color="danger" icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StageDistribution data={field_stage_distribution} />
        <RiskDistribution data={field_risk_distribution} />
        <ObservationTrend data={observation_trend} />
      </div>

      {/* agent performance table */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-poppins font-semibold text-gray-800 mb-1">
          Agent Performance
        </h3>
        <p className="text-xs font-inter text-gray-400 mb-4">
          Field activity per agent
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-inter">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-3 font-medium text-gray-500">Agent</th>
                <th className="pb-3 font-medium text-gray-500">Fields</th>
                <th className="pb-3 font-medium text-gray-500">Observations</th>
                <th className="pb-3 font-medium text-gray-500">Completed</th>
                <th className="pb-3 font-medium text-gray-500">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {agent_performance.map((agent) => {
                const progress = agent.total_fields > 0
                  ? Math.round((agent.completed_fields / agent.total_fields) * 100)
                  : 0
                return (
                  <tr key={agent.agent_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                          {agent.first_name[0]}{agent.last_name[0]}
                        </div>
                        {agent.first_name} {agent.last_name}
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{agent.total_fields}</td>
                    <td className="py-3 text-gray-600">{agent.total_observations}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-success-50 text-success-700 text-xs font-medium">
                        {agent.completed_fields}
                      </span>
                    </td>
                    <td className="py-3 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{progress}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

