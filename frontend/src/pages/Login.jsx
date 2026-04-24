import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  setCredentials,
  setLoading,

  selectIsLoading,

} from '@/store/slices/authSlice'
import { login } from '@/services/auth'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 6 characters'),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectIsLoading)
 const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

 
const onSubmit = async (data) => {
  dispatch(setLoading(true))
  try {
    const { data: responseData } = await login(data)
    dispatch(setCredentials(responseData))
    toast.success(`Welcome back, ${responseData.user.first_name}!`)
    navigate('/dashboard')
  } catch (err) {
    const message = err.response?.data?.detail || 'Invalid email or password.'

    toast.error(message)
  } finally {
    dispatch(setLoading(false))
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2]">
      <div className="w-full max-w-md bg-white rounded-md shadow p-8">
        <h1 className="font-poppins text-center font-semibold text-2xl text-gray-800 mb-6">
          SmartSeason Login
        </h1>

       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2.5 rounded-lg border font-inter text-sm
                 focus:outline-none focus:ring-none focus:border-primary-600 
                ${errors.email ? 'border-danger' : 'border-gray-200'}`}
              placeholder="admin@smartseason.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger font-inter">
                {errors.email.message}
              </p>
            )}
          </div>

         <div>
  <label className="block text-sm font-inter font-medium text-gray-700 mb-1">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      {...register('password')}
      className={`w-full px-4 py-2.5 rounded-lg border font-inter text-sm focus:outline-none focus:ring-none focus:border-primary-600 
        ${errors.password ? 'border-danger' : 'border-gray-200'}`}
      placeholder="******"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
    >
      {showPassword ? (
        <EyeOff size={16} />
      ) : (
        <Eye size={16} />
      )}
    </button>
  </div>
  {errors.password && (
    <p className="mt-1 text-xs text-danger font-inter">
      {errors.password.message}
    </p>
  )}
</div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-md font-montserrat bg-primary-600 text-white  font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage