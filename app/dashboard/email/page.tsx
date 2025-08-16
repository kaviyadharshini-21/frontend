"use client"

import { EmailDashboard } from "@/components/email-dashboard"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EmailDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    console.log('Dashboard auth check:', { isLoading, user: !!user, isRedirecting })
    
    // Add a small delay to allow auth state to settle after login
    const timer = setTimeout(() => {
      if (!isLoading && !user && !isRedirecting) {
        console.log('No user found, redirecting to login')
        setIsRedirecting(true)
        router.push('/login')
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [user, isLoading, router, isRedirecting])

  // Show loading during auth check
  if (isLoading || isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  // If no user after loading, don't render anything (redirect will happen)
  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <EmailDashboard />
    </main>
  )
}

