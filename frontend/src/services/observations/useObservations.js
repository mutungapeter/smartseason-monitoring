import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getObservationsRequest,
  createObservationRequest,
  updateObservationRequest,
  deleteObservationRequest,
} from '@/services/observations'


export const useObservations = (fieldId) =>
  useQuery({
    queryKey: ['observations', fieldId],
    queryFn: () =>
      getObservationsRequest(fieldId).then(res => res.data),
    enabled: !!fieldId,
  })


export const useCreateObservation = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data) => createObservationRequest(data),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ['field', variables.field],
      })
    },
  })
}


export const useUpdateObservation = (fieldId) => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateObservationRequest(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['observations', fieldId] })
      qc.invalidateQueries({ queryKey: ['field', String(fieldId)] })
    },
  })
}

export const useDeleteObservation = (fieldId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => deleteObservationRequest(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['observations', fieldId] })
      qc.invalidateQueries({ queryKey: ['field', String(fieldId)] })
    },
  })
}