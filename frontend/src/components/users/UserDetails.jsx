import Modal from '@/components/shared/Modal'
import { formatDate } from '@/utils/dates'
import { Mail, Phone, Briefcase, CalendarDays, Layers } from 'lucide-react'

const ROLE_STYLES = {
  ADMIN: 'bg-purple-50 text-purple-700 border border-purple-200',
  AGENT: 'bg-primary-50 text-primary-700 border border-primary-200',
}

export default function UserDetailModal({ open, onClose, user }) {
  if (!user) return null

  return (
    <Modal open={open} onClose={onClose} title="User Details" maxWidth="max-w-md"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm border rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Close
        </button>
      }
    >
      <div className="space-y-5">
        {/* avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-semibold font-inter flex-shrink-0">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <p className="font-poppins font-semibold text-gray-800">
              {user.first_name} {user.last_name}
            </p>
            <span className={`text-xs font-inter font-medium px-2.5 py-0.5 rounded-full ${ROLE_STYLES[user.role]}`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* details */}
        <div className="space-y-3 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <Mail size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-inter text-gray-400">Email</p>
              <p className="text-sm font-inter text-gray-700">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-inter text-gray-400">Phone</p>
              <p className="text-sm font-inter text-gray-700">{user.phone_number || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays size={14} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-inter text-gray-400">Joined</p>
              <p className="text-sm font-inter text-gray-700">{formatDate(user.created_at)}</p>
            </div>
          </div>
        </div>

        {/* assigned fields */}
        {user.assigned_fields?.length > 0 && (
          <div className="pt-2 border-t border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-gray-400" />
              <p className="text-xs font-inter text-gray-400">
                Assigned Fields ({user.assigned_fields.length})
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.assigned_fields.map((f) => (
                <span
                  key={f.id}
                  className="text-xs font-inter px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 border border-gray-200"
                >
                  {f.name} · {f.crop_type}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}