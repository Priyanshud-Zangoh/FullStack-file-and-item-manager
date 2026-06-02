import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores'

import Login from './app/routes/Login'
import Register from './app/routes/Register'
import Dashboard from './app/routes/Dashboard'
import ItemManager from './app/routes/ItemManager'
import FileManager from './app/routes/FileManager'

import ProtectedRoute from './features/auth/components/ProtectedRoute'
import AppShell from './components/layout/AppShell'

export default function App() {
  const { fetchUser, isLoading } = useAuthStore()

  useEffect(() => {
    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <span className="spinner" />
        <span>Initializing…</span>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="items" element={<ItemManager />} />
          <Route path="files" element={<FileManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
