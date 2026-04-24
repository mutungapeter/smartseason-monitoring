import { STAGE_COLORS } from '@/constants'
import { formatDate } from '@/utils/dates'
import { CheckCircle, ClipboardList, Layers, Sprout } from 'lucide-react'
import ObservationTrend from './shared/ObservationTrend'
import RiskDistribution from './shared/RiskDistribution'
import StageDistribution from './shared/StageDistribution'
import StatCard from './shared/StatCard'



export default function AgentDashboard({ data }) {
  const {
    overview,
    field_stage_distribution,
    observation_trend,
    agent_dashboard,
  } = data

  const { recent_observations, my_observations, field_risk_distribution } = agent_dashboard

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="font-poppins font-semibold text-xl text-gray-800">
          My Dashboard
        </h2>
        <p className="text-sm font-inter text-gray-500">
          Overview of your assigned fields
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Assigned Fields" value={overview.total_fields} color="primary" icon={Layers} />
        <StatCard label="Active" value={overview.active_fields} color="success" icon={Sprout} />
        <StatCard label="Completed" value={overview.completed_fields} color="info" icon={CheckCircle} />
        <StatCard label="My Observations" value={my_observations} color="warning" icon={ClipboardList} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StageDistribution data={field_stage_distribution} />
        <RiskDistribution data={field_risk_distribution} />
        <ObservationTrend data={observation_trend} />
      </div>

      {/* recent observations */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-poppins font-semibold text-gray-800 mb-1">
          Recent Observations
        </h3>
        <p className="text-xs font-inter text-gray-400 mb-4">
          Your latest field activity
        </p>
        <div className="space-y-3">
          {recent_observations.map((obs, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                <ClipboardList size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-inter font-medium text-gray-800 text-sm">
                    {obs.field_name}
                  </span>
                  <span className="text-xs font-inter text-gray-400">{obs.crop_type}</span>
                  <span className={`ml-auto text-xs font-inter font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[obs.stage]}`}>
                    {obs.stage}
                  </span>
                </div>
                <p className="text-xs font-inter text-gray-500 truncate">{obs.notes}</p>
                <p className="text-xs font-inter text-gray-400 mt-1">
                  {formatDate(obs.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

 