import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout, selectSessionExpired } from '@/store/slices/authSlice'
import { LogIn, Clock } from 'lucide-react'

export default function SessionExpiredModal() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const expired = useSelector(selectSessionExpired)

  if (!expired) return null

  const handleLoginAgain = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Clock size={28} className="text-amber-500" />
        </div>

        <h2 className="font-poppins font-semibold text-gray-800 text-lg mb-2">
          Session Expired
        </h2>
        <p className="text-sm font-inter text-gray-500 mb-6 leading-relaxed">
          Your session has expired due to inactivity. Please log in again to continue.
        </p>

        <button
          onClick={handleLoginAgain}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-inter font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          <LogIn size={16} />
          Log in again
        </button>
      </div>
    </div>
  )
}