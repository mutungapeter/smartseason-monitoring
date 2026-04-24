import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdateObservation } from '@/services/observations/useObservations'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'
import { STAGES } from '@/constants'

const editObservationSchema = z.object({
  stage: z.enum(['PLANTED', 'GROWING', 'READY', 'HARVESTED'], {
    errorMap: () => ({ message: 'Select a valid stage' }),
  }),
  notes: z.string().optional(),
})


const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border font-inter text-sm focus:outline-none focus:border-primary-600
  ${error ? 'border-danger' : 'border-gray-200'}`

export default function EditObservation({ open, onClose, observation, fieldId }) {
  const updateMutation = useUpdateObservation(fieldId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editObservationSchema),
    defaultValues: {
      stage: observation?.stage ?? 'PLANTED',
      notes: observation?.notes ?? '',
    },
  })

  useEffect(() => {
    if (observation) {
      reset({
        stage: observation.stage,
        notes: observation.notes ?? '',
      })
    }
  }, [observation, reset])

  const onSubmit = (data) => {
    updateMutation.mutate(
      { id: observation.id, data },
      {
        onSuccess: () => {
          toast.success('Observation updated successfully.')
          onClose()
        },
        onError: (err) => {
          const detail = err.response?.data
          const message =
            typeof detail === 'string'
              ? detail
              : Object.values(detail || {}).flat().join(' ') ||
                'Failed to update observation.'
          toast.error(message)
        },
      }
    )
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Observation"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="px-4 py-2 text-sm font-inter font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
            className="px-4 py-2 text-sm font-inter font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        {observation && (
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
            <p className="text-xs font-inter text-gray-400 mb-1">Observation by</p>
            <p className="text-sm font-inter font-medium text-gray-800">
              {observation.agent_name}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
            Stage <span className="text-danger">*</span>
          </label>
          <select {...register('stage')} className={inputClass(errors.stage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.stage && (
            <p className="mt-1 text-xs text-danger font-inter">{errors.stage.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
            Notes
            <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Update your observation notes..."
            className={`${inputClass(errors.notes)} resize-none`}
          />
        </div>
      </form>
    </Modal>
  )
}