/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Snackbar } from '../../components/Snackbar'
import { supabase } from '../../supabase'
import { validateEmail, validatePassword } from '../../utils/validation'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState<{ message: string, type: 'success' | 'error' } | null>(null)

  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)

  const navigate = useNavigate()

  // Handle form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Reset validation states
    setIsEmailValid(true)
    setIsPasswordValid(true)

    // Validate email and password
    if (!validateEmail(email)) {
      setIsEmailValid(false)
      setSnackbar({ message: 'Please enter a valid email address.', type: 'error' })
      setLoading(false)
      return
    }

    if (!validatePassword(password)) {
      setIsPasswordValid(false)
      setSnackbar({ message: 'Password must be at least 8 characters long.', type: 'error' })
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSnackbar({ message: 'Login successful!', type: 'success' })
      setTimeout(() => {
        navigate('/')  // Redirect to home page after successful login
      }, 1000)
    } catch (error: any) {
      setSnackbar({ message: error.message || 'Login failed.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}

      <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>


      <form
        onSubmit={handleLogin}
        className="space-y-4"
        noValidate
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 w-full rounded-md border p-2 ${!isEmailValid ? 'border-red-500' : ''}`}
            required
          />
          {!isEmailValid && <p className="text-red-500 text-sm">Please enter a valid email.</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 w-full rounded-md border p-2 ${!isPasswordValid ? 'border-red-500' : ''}`}
            required
          />
          {!isPasswordValid && <p className="text-red-500 text-sm">Password must be at least 8 characters long.</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </>
  )
}
