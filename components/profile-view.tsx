"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/authStore"
import { User, Edit3, Save, X, Mail, Calendar, Settings } from "lucide-react"

interface UserProfile {
  id: string
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
}

export function ProfileView() {
  const { user, token } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editData, setEditData] = useState({
    fullName: "",
  })

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const profileData = await response.json()
        setProfile(profileData)
        setEditData({ fullName: profileData.fullName })
      } catch (err) {
        setError('Failed to load profile data')
        console.error('Profile fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  const handleEdit = () => {
    setIsEditing(true)
    setError("")
    setSuccess("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ fullName: profile?.fullName || "" })
    setError("")
    setSuccess("")
  }

  const handleSave = async () => {
    if (!editData.fullName.trim()) {
      setError("Full name is required")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      // Update profile state
      setProfile(data.user)

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Failed to load profile data.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {!isEditing ? (
              <Button onClick={handleEdit} className="gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="gap-2"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="max-w-md"
                />
              ) : (
                <p className="text-lg">{profile.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Email address cannot be changed. Contact support if you need assistance.
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Account Information</h4>
              <div className="grid gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Member since</span>
                  </div>
                  <span className="text-muted-foreground">{formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>Last updated</span>
                  </div>
                  <span className="text-muted-foreground">{formatDate(profile.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mt-6">
          <h4 className="font-medium mb-4">Profile Picture</h4>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Profile pictures are currently generated based on your initials.
              </p>
              <Button variant="outline" size="sm" disabled>
                Upload Photo (Coming Soon)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}



