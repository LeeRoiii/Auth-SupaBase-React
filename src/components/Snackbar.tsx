import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface SnackbarProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Automatically close snackbar after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for fade-out animation
    }, 5000)

    return () => clearTimeout(timer) // Cleanup on unmount
  }, [onClose])

  return (
    <div
      className={`fixed top-5 right-5 w-full max-w-xs p-4 rounded-lg text-white shadow-lg transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${type === 'success' ? 'bg-green-600 bg-opacity-70' : 'bg-red-600 bg-opacity-70'}`}
    >
      <div className="flex items-center">
        {/* Icon for success or error */}
        <div className="mr-3">
          {type === 'success' ? (
            <FaCheckCircle className="text-xl text-white" />
          ) : (
            <FaTimesCircle className="text-xl text-white" />
          )}
        </div>
        
        <span className="flex-1 text-sm font-semibold">{message}</span>
        
        <button
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="ml-4 text-xl font-bold text-white hover:text-gray-200 transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
