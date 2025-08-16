"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  fullName: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing auth data on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem('authToken')
          localStorage.removeItem('user')
        }
      }
    }
    
    setIsLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    console.log('Auth context login called with:', { token: !!newToken, user: newUser })
    setToken(newToken)
    setUser(newUser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      console.log('Auth data stored in localStorage')
    }
  }

  const logout = async () => {
    try {
      // Call logout API to clear HTTP-only cookie
      await fetch('/api/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API error:', error)
    }
    
    // Clear local state and storage
    setToken(null)
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
    
    // Redirect to login page after logout
    router.push('/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
