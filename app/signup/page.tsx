"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()

  const handleSignupSuccess = () => {
    // Redirect to login page after successful signup
    router.push("/login")
  }

  return <SignupForm onSuccess={handleSignupSuccess} />
}

