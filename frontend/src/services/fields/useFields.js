import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import {
  getFields,
  getField,
  getDashboard,
  getObservations,

createField,
  updateField,
  deleteField,
  assignField,
  createObservation,
} from '@/services/fields'


export const useFields = (params = {}) =>
  useQuery({
    queryKey: ['fields', JSON.stringify(params)],
    queryFn: () => getFields(params).then(res => res.data),
  })


export const useField = (id) =>
  useQuery({
    queryKey: ['field', id],
    queryFn: () => getField(id).then(res => res.data),
    enabled: !!id,
  })


export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then(res => res.data),
  })


export const useObservations = (fieldId) =>
  useQuery({
    queryKey: ['observations', fieldId],
    queryFn: () => getObservations(fieldId).then(res => res.data),
    enabled: !!fieldId,
  })




export const useCreateField = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createField,
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['fields'],
        exact: false,
      })
    },
  })
}


export const useUpdateField = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateField(id, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['fields'],
        exact: false, 
      })
    },
  })
}


export const useDeleteField = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fields'] })
    },
  })
}
export const useAssignField = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignField,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['fields'] })
    },
  })
}

export const useCreateObservation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ fieldId, data }) => createObservation(fieldId, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['observations', variables.fieldId] })
    },
  })
}