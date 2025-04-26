import { Outlet, Navigate } from 'react-router-dom'
import { supabase } from '../supabase';
import { useState, useEffect } from 'react'

export function AuthLayout() {
  const [session, setSession] = useState<null | any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (session) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Outlet />
      </div>
    </div>
  )
}