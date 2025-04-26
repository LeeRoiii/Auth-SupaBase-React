// src/validation.ts

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  };
  
  export const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password !== '';
  };
  
  export const getPasswordRequirementText = (key: string): string => {
    const requirements: Record<string, string> = {
      minLength: 'At least 8 characters',
      hasUpperCase: 'At least one uppercase letter',
      hasLowerCase: 'At least one lowercase letter',
      hasNumber: 'At least one number',
      hasSpecialChar: 'At least one special character',
    };
    return requirements[key] || '';
  };
  

  