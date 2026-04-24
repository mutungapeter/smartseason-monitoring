import Modal from '@/components/shared/Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  isLoading = false,
  variant = 'danger',
}) {
  const variantConfig = {
    danger: {
      button: 'bg-red-500 hover:bg-red-600 text-white',
      icon: 'text-red-500 bg-red-50',
    },
    warning: {
      button: 'bg-warning-500 hover:bg-warning-600 text-white',
      icon: 'text-warning-500 bg-warning-50',
    },
  }

  const config = variantConfig[variant]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-inter font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-inter font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${config.button}`}
          >
            {isLoading ? 'Deleting...' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-lg flex-shrink-0 ${config.icon}`}>
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm font-inter text-gray-600 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  )
}