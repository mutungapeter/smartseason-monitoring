import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'
import { STAGES } from '@/constants'
import { useCreateField } from '@/services/fields/useFields'

const fieldSchema = z.object({
  name: z.string().min(1, 'Field name is required').max(255),
  crop_type: z.string().min(1, 'Crop type is required').max(255),
  planting_date: z.string().min(1, 'Planting date is required'),
  current_stage: z.enum(['PLANTED', 'GROWING', 'READY', 'HARVESTED']),
  threshold_days: z
    .union([
      z.coerce.number().int().min(0, 'Must be 0 or more'),
      z.literal(''),
    ])
    .optional()
    .nullable(),
})

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary-600 ${
    error ? 'border-danger' : 'border-gray-200'
  }`

function AddField({ open, onClose }) {
  const { mutateAsync, isPending } = useCreateField()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      crop_type: '',
      planting_date: '',
      current_stage: 'PLANTED',
      threshold_days: '',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        threshold_days:
          data.threshold_days === '' ? null : Number(data.threshold_days),
      }

      await mutateAsync(payload)

      toast.success('Field created successfully.')
      handleClose()
    } catch (err) {
      const detail = err.response?.data
      const message =
        typeof detail === 'string'
          ? detail
          : Object.values(detail || {}).flat().join(' ') ||
            'Failed to create field.'

      toast.error(message)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add New Field"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg"
          >
            {isPending ? 'Creating...' : 'Create Field'}
          </button>
        </>
      }
    >
      <form className="space-y-4">
        <input {...register('name')} placeholder="Field name" className={inputClass(errors.name)} />
        <input {...register('crop_type')} placeholder="Crop type" className={inputClass(errors.crop_type)} />

        <div className="grid grid-cols-2 gap-4">
          <input type="date" {...register('planting_date')} className={inputClass(errors.planting_date)} />

          <select {...register('current_stage')} className={inputClass(errors.current_stage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          {...register('threshold_days')}
          placeholder="Threshold days"
          className={inputClass(errors.threshold_days)}
        />
      </form>
    </Modal>
  )
}

export default AddField