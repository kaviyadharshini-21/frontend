"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/dashboard/email");
    }
  }, [user, loading, router, isRedirecting]);

  const handleLoginSuccess = (token: string, userData: any) => {
    console.log("Login success called with:", { token: !!token, userData });

    setIsRedirecting(true);

    console.log("About to redirect to dashboard");

    // Small delay to ensure state is updated before redirect
    setTimeout(() => {
      router.replace("/dashboard/email");
    }, 100);
  };

  // Show loading during auth check or redirection
  if (loading || isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  // Don't show login form if user is already authenticated
  if (user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return <LoginForm onSuccess={handleLoginSuccess} />;
}
