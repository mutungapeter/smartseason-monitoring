import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAdmin,
  selectIsAgent,
  selectUser,
} from "@/store/slices/authSlice";
import { useField } from "@/services/fields/useFields";
import { STAGE_COLORS } from "@/constants";
import { formatDate, formatDateTime } from "@/utils/dates";
import CreateObservation from "@/components/fields/CreateObservation";
import {
  ArrowLeft,
  Sprout,
  CalendarDays,
  Clock,
  User,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Activity,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import FieldDetailSkeleton from "@/components/fields/DetailsSkeleton";
import EditObservation from "@/components/fields/EditObservation";
import { useDeleteObservation } from "@/services/observations/useObservations";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/shared/ConfirmModal";

const STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    className: "bg-success-50 text-success-700 border border-success-200",
    icon: CheckCircle,
  },
  AT_RISK: {
    label: "At Risk",
    className: "bg-danger-50 text-danger-700 border border-danger-200",
    icon: AlertTriangle,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    icon: CheckCircle,
  },
};

export default function FieldDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);
  const isAgent = useSelector(selectIsAgent);
  const [editObsOpen, setEditObsOpen] = useState(false);
  const [selectedObs, setSelectedObs] = useState(null);
  const currentUser = useSelector(selectUser);
  console.log("user", currentUser)
  const deleteObsMutation = useDeleteObservation(id);
  const [deleteObs, setDeleteObs] = useState(null);
  const { data: field, isLoading } = useField(id);
  const [observationOpen, setObservationOpen] = useState(false);
 console.log("field", field)
  if (isLoading)
    return (
      <div className="p-6">
        <FieldDetailSkeleton />
      </div>
    );

  if (!field)
    return (
      <div className="p-6 text-center text-sm font-inter text-gray-500">
        Field not found.
      </div>
    );

  const statusConfig = STATUS_CONFIG[field.status] ?? STATUS_CONFIG.ACTIVE;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="font-poppins font-semibold text-gray-800 text-lg leading-tight">
            {field.name}
          </h2>
          <p className="text-xs font-inter text-gray-400">{field.crop_type}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <Sprout size={18} />
            </div>
            <div>
              <p className="font-poppins font-semibold text-gray-800">
                {field.name}
              </p>
              <p className="text-xs font-inter text-gray-400">
                {field.crop_type}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-inter font-medium px-2.5 py-1 rounded-full ${STAGE_COLORS[field.current_stage]}`}
            >
              {field.current_stage}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-inter font-medium px-2.5 py-1 rounded-full ${statusConfig.className}`}
            >
              <StatusIcon size={11} />
              {statusConfig.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-start gap-2">
            <CalendarDays
              size={14}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-inter text-gray-400">Planting Date</p>
              <p className="text-sm font-inter font-medium text-gray-700">
                {formatDate(field.planting_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-inter text-gray-400">Threshold Days</p>
              <p className="text-sm font-inter font-medium text-gray-700">
                {field.threshold_days ?? "90 (default)"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-inter text-gray-400">Assigned Agent</p>
              <p className="text-sm font-inter font-medium text-gray-700">
                {field.assignments?.[0]?.agent_name ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ClipboardList
              size={14}
              className="text-gray-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-inter text-gray-400">Observations</p>
              <p className="text-sm font-inter font-medium text-gray-700">
                {field.observation_count}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-poppins font-semibold text-gray-800 text-sm">
                Assignment
              </h3>
              <p className="text-xs font-inter text-gray-400 mt-0.5">
                {field.assignment_count} agent assigned
              </p>
            </div>
          </div>

          {field.assignments.length === 0 ? (
            <div className="text-center py-8 text-sm font-inter text-gray-400">
              No agent assigned yet.
            </div>
          ) : (
            <div className="space-y-3">
              {field.assignments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold font-inter flex-shrink-0">
                    {a.agent_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-inter font-medium text-gray-800">
                      {a.agent_name}
                    </p>
                    <p className="text-xs font-inter text-gray-400 truncate">
                      {a.agent_email}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-inter text-gray-400">Assigned</p>
                    <p className="text-xs font-inter text-gray-600">
                      {formatDate(a.assigned_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-poppins font-semibold text-gray-800 text-sm">
                Observations
              </h3>
              <p className="text-xs font-inter text-gray-400 mt-0.5">
                {field.observation_count} total
              </p>
            </div>

            {isAgent && (
              <button
                onClick={() => setObservationOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-inter font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Plus size={12} />
                Add Observation
              </button>
            )}
          </div>

          {field.observations.length === 0 ? (
            <div className="text-center py-8 text-sm font-inter text-gray-400">
              No observations recorded yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {field.observations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                        <Activity size={11} />
                      </div>
                      <span className="text-xs font-inter font-medium text-gray-700">
                        {obs.agent_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-inter font-medium px-2 py-0.5 rounded-full ${STAGE_COLORS[obs.stage]}`}
                      >
                        {obs.stage}
                      </span>

                      {(isAdmin || obs.agent_id === Number(currentUser?.id)) && (
                        <button
                          onClick={() => {
                            setSelectedObs(obs);
                            setEditObsOpen(true);
                          }}
                          className="p-1 rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Pencil size={11} />
                        </button>
                      )}
                      {(isAdmin || obs.agent_id === Number(currentUser?.id)) && (
                        <button
                          onClick={() => setDeleteObs(obs)}
                          className="p-1 rounded border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                  {obs.notes && (
                    <p className="text-xs font-inter text-gray-500 ml-8 mb-1">
                      {obs.notes}
                    </p>
                  )}
                  <p className="text-xs font-inter text-gray-400 ml-8">
                    {formatDateTime(obs.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditObservation
        open={editObsOpen}
        onClose={() => {
          setEditObsOpen(false);
          setSelectedObs(null);
        }}
        observation={selectedObs}
        fieldId={id}
      />
      <CreateObservation
        open={observationOpen}
        onClose={() => setObservationOpen(false)}
        field={field}
      />
      <ConfirmModal
        open={!!deleteObs}
        onClose={() => setDeleteObs(null)}
        onConfirm={async () => {
          try {
            await deleteObsMutation.mutateAsync(deleteObs.id);
            toast.success("Observation deleted.");
            setDeleteObs(null);
          } catch {
            toast.error("Failed to delete observation.");
          }
        }}
        title="Delete Observation"
        message={`Are you sure you want to delete this observation by ${deleteObs?.agent_name}? This cannot be undone.`}
        isLoading={deleteObsMutation.isPending}
      />
    </div>
  );
}
