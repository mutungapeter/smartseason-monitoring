import api from '../axios'

export const getFields = (params = {}) => api.get('fields/', { params })
export const getField = (id) => api.get(`fields/${id}/`)
export const getDashboard = () => api.get('fields/dashboard-overview/')
export const getObservations = (fieldId) => api.get(`fields/${fieldId}/observations/`)

export const createField = (data) => api.post('fields/create/', data)
export const updateField = (id, data) => api.patch(`fields/${id}/`, data)
export const deleteField = (id) => api.delete(`fields/${id}/`)
export const assignField = (data) => api.post('fields/assign/', data)
export const createObservation = (fieldId, data) => api.post(`fields/${fieldId}/observations/`, data)