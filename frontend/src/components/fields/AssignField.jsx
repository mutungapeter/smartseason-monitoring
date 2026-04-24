import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAssignField } from '@/services/fields/useFields'
import { useAgents } from '@/services/auth/useAuth'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'

const assignSchema = z.object({
  agent: z.string().min(1, 'Please select an agent'),
})

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border font-inter text-sm focus:outline-none focus:border-primary-600
  ${error ? 'border-danger' : 'border-gray-200'}`

export default function AssignField({ open, onClose, field, onAssigned }) {
  const { data: agentsData, isLoading: agentsLoading } = useAgents()
  const agents = agentsData?.results ?? agentsData ?? []

  const assignMutation = useAssignField()

  const assignedAgent = field?.assigned_agent ?? null
  const isReassigning = !!assignedAgent

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(assignSchema),
    defaultValues: { agent: '' },
  })

  const onSubmit = async (data) => {
    try {
      await assignMutation.mutateAsync({
        field: field.id,
        agent: Number(data.agent),
      })
      toast.success(
        isReassigning
          ? `${field.name} reassigned successfully.`
          : `${field.name} assigned successfully.`
      )
      reset()
      onClose()
      onAssigned?.()
    } catch (err) {
      const detail = err.response?.data
      const message =
        typeof detail === 'string'
          ? detail
          : Object.values(detail || {}).flat().join(' ') ||
            'Failed to assign field.'
      toast.error(message)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isReassigning ? 'Reassign Field' : 'Assign Field'}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={assignMutation.isPending}
            className="px-4 py-2 text-sm font-inter font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={assignMutation.isPending || agentsLoading}
            className="px-4 py-2 text-sm font-inter font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {assignMutation.isPending
              ? isReassigning ? 'Reassigning...' : 'Assigning...'
              : isReassigning ? 'Reassign' : 'Assign'}
          </button>
        </>
      }
    >
      <form className="space-y-4">

     
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs font-inter text-gray-400 mb-1">Field</p>
          <p className="text-sm font-inter font-medium text-gray-800">
            {field?.name}
          </p>
          <p className="text-xs font-inter text-gray-500 mt-0.5">
            {field?.crop_type} &bull; {field?.current_stage}
          </p>
        </div>

     
        {isReassigning && (
          <div className="p-3 rounded-lg bg-warning-50 border border-warning-100">
            <p className="text-xs font-inter font-medium text-warning-700 mb-2">
              Currently assigned to
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-warning-100 text-warning-700 flex items-center justify-center text-xs font-semibold font-inter shrink-0">
                {assignedAgent.first_name[0]}{assignedAgent.last_name[0]}
              </div>
              <div>
                <p className="text-sm font-inter font-medium text-warning-800">
                  {assignedAgent.first_name} {assignedAgent.last_name}
                </p>
                <p className="text-xs font-inter text-warning-600">
                  {assignedAgent.email}
                </p>
              </div>
            </div>
          </div>
        )}

      
        <div>
          <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
            {isReassigning ? 'Select New Agent' : 'Select Agent'}
            <span className="text-danger ml-1">*</span>
          </label>
          {agentsLoading ? (
            <div className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-inter text-gray-400">
              Loading agents...
            </div>
          ) : (
            <select
              {...register('agent')}
              className={inputClass(errors.agent)}
            >
              <option value="">Select an agent</option>
              {agents
                .filter((a) => a.id !== assignedAgent?.id)
                .map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.first_name} {agent.last_name} — {agent.email}
                  </option>
                ))}
            </select>
          )}
          {errors.agent && (
            <p className="mt-1 text-xs text-danger font-inter">
              {errors.agent.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  )
}