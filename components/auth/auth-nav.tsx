"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export function AuthNav() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium">{user.fullName}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  )
}

