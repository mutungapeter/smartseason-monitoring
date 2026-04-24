import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAdmin } from '@/store/slices/authSlice'
import { PAGE_SIZE, STAGE_COLORS, STAGES } from '@/constants'
import { formatDate } from '@/utils/dates'
import { Pagination } from '@/components/shared/Pagination'
import DataTable from '@/components/shared/DataTable'
import AddField from '@/components/fields/CreateField'
import UpdateField from '@/components/fields/EditField'
import AssignField from '@/components/fields/AssignField'
import { useFields, useDeleteField } from '@/services/fields/useFields'
import { Pencil, Trash2, Eye, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/shared/ConfirmModal'


export default function FieldsPage() {
  const isAdmin = useSelector(selectIsAdmin)

  const [page, setPage] = useState(1)
  const [stage, setStage] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedField, setSelectedField] = useState(null)
  const [assigningField, setAssigningField] = useState(null)
  const navigate = useNavigate()
  const [deleteField, setDeleteField] = useState(null)
  const { data, isLoading, refetch } = useFields({
    page,
    page_size: PAGE_SIZE,
    ...(stage && { current_stage: stage }),
  })

  const deleteMutation = useDeleteField()
  const totalItems = data?.count ?? 0

  const handleStageChange = (e) => {
    setStage(e.target.value)
    setPage(1)
  }

  const handleEdit = (field) => {
    setSelectedField(field)
    setEditOpen(true)
  }

const handleDelete = (field) => {
  setDeleteField(field)
}


  const handleView = (field) => {
    navigate(`/dashboard/fields/${field.id}`)
  }

  const COLUMNS = [
    {
      header: 'Field',
      accessor: 'name',
      cell: (row) => (
        <span className="font-inter text-sm font-medium text-gray-800">{row.name}</span>
      ),
    },
    { header: 'Crop Type', accessor: 'crop_type' },
    {
      header: 'Stage',
      accessor: 'current_stage',
      cell: (row) => (
        <span className={`text-[10px] font-montserrat font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[row.current_stage]}`}>
          {row.current_stage}
        </span>
      ),
    },
    {
      header: 'Planting Date',
      accessor: 'planting_date',
      cell: (row) => (
        <span className='text-xs'>
 {formatDate(row.planting_date)}
        </span>
       
      ),
    },
    {
      header: 'Threshold Days',
      accessor: 'threshold_days',
      cell: (row) => (
        <span className="text-gray-500 font-montserrat">{row.threshold_days ?? '—'}</span>
      ),
    },
    {
      header: 'Assigned Agent',
      accessor: 'assigned_agent',
      cell: (row) => {
        const agent = row.assigned_agent
        if (!agent) return (
          <span className="text-xs font-montserrat text-gray-400 italic">Unassigned</span>
        )
        return (
          <div className="flex items-center gap-2">
            
            <div>
              <p className="text-xs font-montserrat font-medium text-gray-800 leading-tight">
                {agent.first_name} {agent.last_name}
              </p>
             
            </div>
          </div>
        )
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">

          {/* view */}
          <button
            onClick={() => handleView(row)}
            title="View details"
            className="p-1 rounded border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors"
          >
            <Eye size={13} />
          </button>

          {isAdmin && (
            <>
              {/* assign */}
              <button
                onClick={() => setAssigningField(row)}
                title={row.assigned_agent ? 'Reassign agent' : 'Assign agent'}
                className="p-1 rounded border border-primary-200 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:border-primary-300 transition-colors"
              >
                <UserPlus size={13} />
              </button>

              {/* edit */}
              <button
                onClick={() => handleEdit(row)}
                title="Edit field"
                className="p-1 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-colors"
              >
                <Pencil size={13} />
              </button>

              {/* delete */}
             <button
  onClick={() => handleDelete(row)}
  title="Delete field"
  className="p-1 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:border-red-300 transition-colors"
>
  <Trash2 size={13} />
</button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

      {/* header */}
      <div className="px-5 py-4 border-b flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-poppins font-semibold text-gray-800">Fields</h3>
          <p className="text-xs font-montserrat text-gray-400 mt-0.5">{totalItems} fields total</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={stage}
            onChange={handleStageChange}
            className="text-sm font-montserrat cursor-pointer border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {isAdmin && (
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-1.5 text-sm font-montserrat font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              + Add Field
            </button>
          )}
        </div>
      </div>

     
      <DataTable
        data={data?.results ?? []}
        columns={COLUMNS}
        isLoading={isLoading}
      />

     
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

     
      <AddField
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

    
      <UpdateField
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setSelectedField(null)
        }}
        field={selectedField}
      />

      
      <AssignField
        open={!!assigningField}
        onClose={() => setAssigningField(null)}
        field={assigningField}
        onAssigned={() => {
          setAssigningField(null)
          refetch()
        }}
      />
      <ConfirmModal
  open={!!deleteField}
  onClose={() => setDeleteField(null)}
  onConfirm={async () => {
    try {
      await deleteMutation.mutateAsync(deleteField.id)
      toast.success('Field deleted successfully.')
      setDeleteField(null)
    } catch {
      toast.error('Failed to delete field.')
    }
  }}
  title="Delete Field"
  message={`Are you sure you want to delete "${deleteField?.name}"? This action cannot be undone and will remove all associated observations.`}
  isLoading={deleteMutation.isPending}
/>
    </div>
  )
}