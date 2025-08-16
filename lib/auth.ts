import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    return null
  }
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

