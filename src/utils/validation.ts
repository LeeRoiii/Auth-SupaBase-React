// src/validation/validation.ts

// Email validation regex
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }
  
  // Password validation (minimum length)
  export const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }
  