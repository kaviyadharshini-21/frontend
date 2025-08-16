"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useEffect, useState } from "react"

export default function SignupPage() {
  const router = useRouter()
  const { user, loading } = useAuthStore()
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/email");
    }
  }, [user, loading, router, isRedirecting]);

  const handleSignupSuccess = () => {
    // After successful signup, user will be automatically logged in
    // and redirected to dashboard
    setIsRedirecting(true);
    router.push("/dashboard/email");
  }

  // Show loading during auth check or redirection
  if (loading || isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // Don't show signup form if user is already authenticated
  if (user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return <SignupForm onSuccess={handleSignupSuccess} />
}

