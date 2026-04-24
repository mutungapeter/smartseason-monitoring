import api from '../axios'

export const login = (credentials) => api.post('users/auth/login/', credentials)
export const logout = (refresh) => api.post('users/auth/logout/', { refresh })
export const getMe = () => api.get('users/auth/me/')
export const getUsers = (params = {}) => api.get('users/', { params })
export const getUser = (id) => api.get(`/users/${id}/`)
export const createUser = (data) => api.post('/users/create/', data)
export const updateUser = (id, data) => api.patch(`/users/${id}/`, data)
export const deleteUser = (id) => api.delete(`/users/${id}/`)
