import { createSlice } from '@reduxjs/toolkit'

const storedUser = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: storedUser ? { ...storedUser, id: Number(storedUser.id) } : null,
  token: localStorage.getItem('access_token') || null,
  refresh: localStorage.getItem('refresh_token') || null,
  isLoading: false,
  error: null,
  sessionExpired: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access, refresh } = action.payload
      const normalizedUser = { ...user, id: Number(user.id) }
      state.user = normalizedUser
      state.token = access
      state.refresh = refresh
      state.error = null
      state.sessionExpired = false
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      localStorage.setItem('user', JSON.stringify(normalizedUser))
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refresh = null
      state.error = null
      state.isLoading = false
      state.sessionExpired = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
    sessionExpired: (state) => {
      state.user = null
      state.token = null
      state.refresh = null
      state.sessionExpired = true
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, setLoading, setError, logout, sessionExpired } = authSlice.actions
export default authSlice.reducer

export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectRefresh = (state) => state.auth.refresh
export const selectIsAuthenticated = (state) => !!state.auth.token
export const selectIsLoading = (state) => state.auth.isLoading
export const selectError = (state) => state.auth.error
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN'
export const selectIsAgent = (state) => state.auth.user?.role === 'AGENT'
export const selectSessionExpired = (state) => state.auth.sessionExpired