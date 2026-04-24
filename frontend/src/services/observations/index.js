import api from '../axios'

export const getObservationsRequest = (fieldId) =>
  api.get(`/fields/${fieldId}/observations/`)

export const createObservationRequest = (data) =>
  api.post(`/fields/observations/create/`, data)

export const updateObservationRequest = (id, data) =>
  api.patch(`fields/observations/${id}/`, data)


export const deleteObservationRequest = (id) =>
  api.delete(`fields/observations/${id}/`)