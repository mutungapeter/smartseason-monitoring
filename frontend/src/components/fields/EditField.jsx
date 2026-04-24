import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'
import { STAGES } from '@/constants'
import { useUpdateField } from '@/services/fields/useFields'

const schema = z.object({
  name: z.string().min(1).max(255),
  crop_type: z.string().min(1).max(255),
  planting_date: z.string().min(1),
  current_stage: z.enum(['PLANTED', 'GROWING', 'READY', 'HARVESTED']),
  threshold_days: z
    .union([z.coerce.number().int().min(0), z.literal('')])
    .optional()
    .nullable(),
})

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary-600 ${
    error ? 'border-danger' : 'border-gray-200'
  }`

function UpdateField({ open, onClose, field }) {
  const { mutateAsync, isPending } = useUpdateField()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      crop_type: '',
      planting_date: '',
      current_stage: 'PLANTED',
      threshold_days: '',
    },
  })

  useEffect(() => {
    if (field) {
      reset({
        name: field.name,
        crop_type: field.crop_type,
        planting_date: field.planting_date,
        current_stage: field.current_stage,
        threshold_days: field.threshold_days ?? '',
      })
    }
  }, [field, reset])

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

      await mutateAsync({ id: field.id, data: payload })

      toast.success('Field updated successfully')
      handleClose()
    } catch (err) {
      toast.error('Failed to update field')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Field"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-dark"
          >
            {isPending ? 'Updating...' : 'Update Field'}
          </button>
        </>
      }
    >
      <form className="space-y-4">

        {/* Name */}
        <div>
          <input
            {...register('name')}
            placeholder="Field name"
            className={inputClass(errors.name)}
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Crop type */}
        <div>
          <input
            {...register('crop_type')}
            placeholder="Crop type"
            className={inputClass(errors.crop_type)}
          />
          {errors.crop_type && (
            <p className="text-xs text-danger mt-1">
              {errors.crop_type.message}
            </p>
          )}
        </div>

        {/* Grid fields */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <input
              type="date"
              {...register('planting_date')}
              className={inputClass(errors.planting_date)}
            />
            {errors.planting_date && (
              <p className="text-xs text-danger mt-1">
                {errors.planting_date.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register('current_stage')}
              className={inputClass(errors.current_stage)}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {errors.current_stage && (
              <p className="text-xs text-danger mt-1">
                {errors.current_stage.message}
              </p>
            )}
          </div>
        </div>

        {/* Threshold */}
        <div>
          <input
            type="number"
            {...register('threshold_days')}
            placeholder="Threshold days"
            className={inputClass(errors.threshold_days)}
          />
          {errors.threshold_days && (
            <p className="text-xs text-danger mt-1">
              {errors.threshold_days.message}
            </p>
          )}
        </div>

      </form>
    </Modal>
  )
}

export default UpdateField