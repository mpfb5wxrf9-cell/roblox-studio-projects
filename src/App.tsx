import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { ErrorBoundary } from './components/layout/ErrorBoundary'
import { LoginPage } from './pages/LoginPage'

// The owner dashboard pulls in FullCalendar, which is the single heaviest
// dependency in the app — lazy-loading it keeps that weight out of the
// bundle every regular user downloads just to see their own requests.
const UserDashboardPage = lazy(() =>
  import('./pages/UserDashboardPage').then((m) => ({ default: m.UserDashboardPage })),
)
const OwnerDashboardPage = lazy(() =>
  import('./pages/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage })),
)

function RootRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'owner' ? '/owner' : '/dashboard'} replace />
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  )
}
