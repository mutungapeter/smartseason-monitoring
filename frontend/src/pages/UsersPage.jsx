import { useState } from 'react'
import { Pencil, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUsers, useDeleteUser } from '@/services/auth/useAuth'
import { formatDate } from '@/utils/dates'
import { PAGE_SIZE } from '@/constants'
import DataTable from '@/components/shared/DataTable'
import { Pagination } from '@/components/shared/Pagination'
import ConfirmModal from '@/components/shared/ConfirmModal'
import CreateUser from '@/components/users/CreateUser'
import EditUser from '@/components/users/EditUser'
import UserDetailModal from '@/components/users/UserDetails'

const ROLE_STYLES = {
  ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200',
  AGENT: 'bg-primary-50 text-primary-700 border border-primary-200',
}

export default function ManageUsersPage() {
  const [page, setPage] = useState(1)
  const [role, setRole] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [viewUser, setViewUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(null)

  const { data, isLoading } = useUsers({
    page,
    page_size: PAGE_SIZE,
    ...(role && { role }),
  })

  const deleteMutation = useDeleteUser()
  const totalItems = data?.count ?? 0

  const COLUMNS = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold font-inter flex-shrink-0">
            {row.first_name?.[0]}{row.last_name?.[0]}
          </div>
          <div>
            <p className="text-sm font-inter font-medium text-gray-800">
              {row.first_name} {row.last_name}
            </p>
            <p className="text-xs font-inter text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      cell: (row) => (
        <span className={`text-xs font-inter font-medium px-2.5 py-0.5 rounded-full ${ROLE_STYLES[row.role]}`}>
          {row.role}
        </span>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone_number',
      cell: (row) => (
        <span className="text-sm font-inter text-gray-500">
          {row.phone_number || '—'}
        </span>
      ),
    },
    {
      header: 'Assigned Fields',
      accessor: 'assigned_fields',
      cell: (row) => (
        <span className="text-sm font-inter text-gray-600">
          {row.assigned_fields?.length ?? 0} fields
        </span>
      ),
    },
    {
      header: 'Joined',
      accessor: 'created_at',
      cell: (row) => (
        <span className="text-xs font-inter text-gray-500">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewUser(row)}
            title="View details"
            className="p-1 rounded border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => setEditUser(row)}
            title="Edit user"
            className="p-1 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => setDeleteUser(row)}
            title="Delete user"
            className="p-1 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* header */}
      <div className="px-5 py-4 border-b flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-poppins font-semibold text-gray-800">Users</h3>
          <p className="text-xs font-inter text-gray-400 mt-0.5">{totalItems} users total</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setPage(1) }}
            className="text-sm font-inter cursor-pointer border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="AGENT">Agent</option>
          </select>
          <button
            onClick={() => setCreateOpen(true)}
            className="px-4 py-1.5 text-sm font-inter font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            + Add User
          </button>
        </div>
      </div>

      <DataTable data={data?.results ?? []} columns={COLUMNS} isLoading={isLoading} />

      {!isLoading && (
        <div className="px-5 py-3 border-t">
          <Pagination
            currentPage={page}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}

      <CreateUser open={createOpen} onClose={() => setCreateOpen(false)} />

      <EditUser
        open={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
      />

      <UserDetailModal
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        user={viewUser}
      />

      <ConfirmModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(deleteUser.id)
            toast.success('User deleted successfully.')
            setDeleteUser(null)
          } catch {
            toast.error('Failed to delete user.')
          }
        }}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteUser?.first_name} ${deleteUser?.last_name}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}