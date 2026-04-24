import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateObservation } from '@/services/observations/useObservations'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'

const observationSchema = z.object({
  stage: z.enum(['PLANTED', 'GROWING', 'READY', 'HARVESTED'], {
    errorMap: () => ({ message: 'Select a valid stage' }),
  }),
  notes: z.string().optional(),
})

const STAGES = ['PLANTED', 'GROWING', 'READY', 'HARVESTED']

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border font-inter text-sm focus:outline-none focus:border-primary-600
  ${error ? 'border-danger' : 'border-gray-200'}`

export default function CreateObservation({ open, onClose, field }) {
  const createMutation = useCreateObservation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(observationSchema),
    defaultValues: {
      stage: field?.current_stage ?? 'PLANTED',
      notes: '',
    },
  })

  const onSubmit = async (data) => {
  try {
    await createMutation.mutateAsync({
      field: field.id,       
      stage: data.stage,
      notes: data.notes ?? '',
    })
    toast.success('Observation recorded successfully.')
    reset()
    onClose()
  }  catch (err) {
    toast.error(err.response?.data?.error ?? 'Failed to record observation.')
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
      title="Record Observation"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="px-4 py-2 text-sm font-inter font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="px-4 py-2 text-sm font-inter font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Observation'}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        {/* field context */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <p className="text-xs font-inter text-gray-400 mb-1">Field</p>
          <p className="text-sm font-inter font-medium text-gray-800">{field?.name}</p>
          <p className="text-xs font-inter text-gray-500 mt-0.5">
            {field?.crop_type} &bull; Current stage: {field?.current_stage}
          </p>
        </div>

        {/* stage */}
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

        {/* notes */}
        <div>
          <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
            Notes
            <span className="ml-1 text-xs text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            placeholder="Describe what you observed in the field..."
            className={`${inputClass(errors.notes)} resize-none`}
          />
        </div>
      </form>
    </Modal>
  )
}