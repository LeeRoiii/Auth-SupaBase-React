import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa'
import { Snackbar } from '../../components/Snackbar'
import { supabase } from '../../supabase'
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordsMatch, 
  getPasswordRequirementText 
} from '../../utils/validationsignup';

export function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [snackbar, setSnackbar] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const navigate = useNavigate()

  // Validation states
  const [validEmail, setValidEmail] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  })
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  
  // Track if the user has started typing in the password field
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Email validation
  useEffect(() => {
    setValidEmail(validateEmail(email))
  }, [email])

  // Password validation
  useEffect(() => {
    setPasswordValidation(validatePassword(password))
  }, [password])

  // Check if passwords match
  useEffect(() => {
    setPasswordsMatch(validatePasswordsMatch(password, confirmPassword))
  }, [password, confirmPassword])

  // Calculate if form is valid
  const isFormValid = validEmail && 
    passwordValidation.minLength && 
    passwordValidation.hasUpperCase && 
    passwordValidation.hasLowerCase && 
    passwordValidation.hasNumber && 
    passwordValidation.hasSpecialChar && 
    passwordsMatch

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Final validation check
    if (!isFormValid) {
      setSnackbar({
        message: 'Please fix all validation errors before submitting.',
        type: 'error',
      })
      return
    }
    
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        handleError(error.message)
        setLoading(false)
        return
      }

      if (!data || !data.user || (data.user.identities && data.user.identities.length === 0)) {
        setSnackbar({
          message: 'This email is already registered. Please use a different email or login.',
          type: 'error',
        })
        setLoading(false)
        return
      }

      setSnackbar({
        message: 'Check your email for confirmation!',
        type: 'success',
      })
      setIsSignedUp(true)

      // Optionally navigate after some delay
      setTimeout(() => {
        navigate('/login')
      }, 1000)

      setLoading(false)
    } catch (err) {
      console.error('Signup error:', err)
      setSnackbar({
        message: 'Something went wrong. Please try again.',
        type: 'error',
      })
      setLoading(false)
    }
  }

  // Error handler for Supabase signup issues
  const handleError = (errorMessage: string) => {
    if (errorMessage.includes('already registered') || 
        errorMessage.includes('already exists') || 
        errorMessage.includes('already taken')) {
      setSnackbar({
        message: 'This email is already registered. Please use a different email or login.',
        type: 'error',
      })
    } else if (errorMessage.includes('email')) {
      setSnackbar({
        message: 'Invalid email format.',
        type: 'error',
      })
    } else if (errorMessage.includes('password')) {
      setSnackbar({
        message: 'Password does not meet requirements.',
        type: 'error',
      })
    } else {
      setSnackbar({
        message: errorMessage,
        type: 'error',
      })
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

      <h1 className="mb-6 text-2xl font-bold text-center">Sign Up</h1>

      {isSignedUp ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-green-600">
            Signup complete! 🎉
          </h2>
          <p className="text-sm text-gray-600 mt-4">
            Please check your email to confirm your account.
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6 max-w-md mx-auto" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full rounded-md border p-2 ${!validEmail && email ? 'border-red-500' : ''}`}
              required
            />
            {!validEmail && email && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => { 
                  setPassword(e.target.value);
                  setPasswordTouched(true); // Mark password as touched
                }}
                className={`mt-1 w-full rounded-md border p-2 pr-10 ${!Object.values(passwordValidation).every(Boolean) && password ? 'border-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {passwordVisible ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
            {passwordTouched && (
              <div className="mt-2 text-xs space-y-1">
                {Object.entries(passwordValidation).map(([key, valid]) => !valid && (
                  <p key={key} className="text-red-500 flex items-center">
                    <FaTimes className="mr-1" /> {getPasswordRequirementText(key)}
                  </p>
                ))}
                {Object.values(passwordValidation).every(Boolean) && (
                  <p className="text-green-500">Password meets all requirements</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={confirmPasswordVisible ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 w-full rounded-md border p-2 pr-10 ${!passwordsMatch && confirmPassword ? 'border-red-500' : ''}`}
                required
              />
              <button
                type="button"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {confirmPasswordVisible ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full rounded-md bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </>
  )
}
