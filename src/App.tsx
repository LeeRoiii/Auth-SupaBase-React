import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './components/AuthLayout'
import { Home } from './pages/AuthenticationPage/Home'
import { Login } from './pages/AuthenticationPage/Login'
import { Signup } from './pages/AuthenticationPage/Signup'
import { ProtectedRoute } from './components/ProtectedRoute'
import { supabase } from './supabase'
import { useEffect, useState } from 'react'

export default function App() {
  const [session, setSession] = useState<any | null | undefined>(undefined)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route path="/signup" element={<AuthLayout />}>
          <Route index element={<Signup />} />
        </Route>

        <Route
          path="/"
          element={
            <ProtectedRoute session={session}>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            session ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </div>
  )
}
