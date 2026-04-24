import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/shared/Modal'
import toast from 'react-hot-toast'
import { useUpdateUser } from '@/services/auth/useAuth'

const schema = z.object({
  first_name: z.string().max(150).optional(),
  last_name: z.string().max(150).optional(),
  email: z.string().email().min(1).max(254),
  phone_number: z.string().max(20).optional(),
  role: z.enum(['ADMIN', 'AGENT']),
  password: z.string().min(1).optional().or(z.literal('')),
})

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary-600 ${
    error ? 'border-danger' : 'border-gray-200'
  }`

export default function EditUser({ open, onClose, user }) {
  const { mutateAsync, isPending } = useUpdateUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role: 'AGENT',
      password: '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        phone_number: user.phone_number ?? '',
        role: user.role,
        password: '',
      })
    }
  }, [user, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data) => {
    try {
      const payload = { ...data }
      if (!payload.password) delete payload.password
      await mutateAsync({ id: user.id, data: payload })
      toast.success('User updated successfully.')
      handleClose()
    } catch (err) {
      toast.error(err.response?.data?.error ?? 'Failed to update user.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit User"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-dark disabled:opacity-60"
          >
            {isPending ? 'Updating...' : 'Update User'}
          </button>
        </>
      }
    >
      <form className="space-y-4">
  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">First Name</label>
      <input
        {...register('first_name')}
        placeholder="First name"
        className={inputClass(errors.first_name)}
      />
    </div>
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Last Name</label>
      <input
        {...register('last_name')}
        placeholder="Last name"
        className={inputClass(errors.last_name)}
      />
    </div>
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">Email Address</label>
    <input
      {...register('email')}
      type="email"
      placeholder="Email address"
      className={inputClass(errors.email)}
    />
    {errors.email && (
      <p className="text-xs text-danger mt-1">{errors.email.message}</p>
    )}
  </div>

  <div className="grid grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
      <input
        {...register('phone_number')}
        placeholder="Phone number (optional)"
        className={inputClass(errors.phone_number)}
      />
    </div>
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">Role</label>
      <select {...register('role')} className={inputClass(errors.role)}>
        <option value="AGENT">Agent</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">Password</label>
    <input
      {...register('password')}
      type="password"
      placeholder="New password (leave blank to keep current)"
      className={inputClass(errors.password)}
    />
    {errors.password && (
      <p className="text-xs text-danger mt-1">{errors.password.message}</p>
    )}
  </div>
</form>
    </Modal>
  )
}