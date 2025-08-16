"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const { login, user, isLoading } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isLoading && user && !isRedirecting) {
      setIsRedirecting(true)
      router.push("/dashboard/email")
    }
  }, [user, isLoading, router, isRedirecting])

  const handleLoginSuccess = (token: string, userData: any) => {
    console.log('Login success called with:', { token: !!token, userData })
    
    // Update auth context with user data
    login(token, userData)
    setIsRedirecting(true)
    
    console.log('About to redirect to dashboard')
    
    // Small delay to ensure state is updated before redirect
    setTimeout(() => {
      router.replace("/dashboard/email")
    }, 100)
  }

  // Show loading during auth check or redirection
  if (isLoading || isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  // Don't show login form if user is already authenticated
  if (user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return <LoginForm onSuccess={handleLoginSuccess} />
}

