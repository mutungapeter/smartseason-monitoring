import { useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { selectIsAuthenticated } from '@/store/slices/authSlice'


import DashboardLayout from './components/Layout'
import LoginPage from './pages/Login'
import DashboardPage from './pages/DashboardPage'
import FieldsListPage from './pages/FieldsPage'
import FieldDetailPage from './pages/FieldDetailPage'
import ManageUsersPage from './pages/UsersPage'
import SessionExpiredModal from './components/shared/SessionExpiredModal'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <BrowserRouter>
     <SessionExpiredModal />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage />
          }
        />

    
       <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardPage />} />
  <Route path="fields" element={<FieldsListPage />} />
  <Route path="fields/:id" element={<FieldDetailPage />} />
  <Route path="manage-users" element={<ManageUsersPage />} />
</Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App