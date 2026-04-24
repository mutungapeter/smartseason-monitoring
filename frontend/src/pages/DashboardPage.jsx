import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '@/store/slices/authSlice'

import AdminDashboard from '@/components/dashboard/AdminDashboardContent'
import AgentDashboard from '@/components/dashboard/AgentDashboardContent'
import toast from 'react-hot-toast'
import { getDashboard } from '@/services/fields'

export default function DashboardPage() {
  const isAdmin = useSelector(selectIsAdmin)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: response } = await getDashboard()
        setData(response)
      } catch {
        toast.error('Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <DashboardSkeleton />
  if (!data) return null

  return isAdmin ? <AdminDashboard data={data} /> : <AgentDashboard data={data} />
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

